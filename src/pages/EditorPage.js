import React, { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Editor from "../components/Editor";
import EditorSidebar from "../components/EditorSidebar";
import { language, cmtheme } from "../atoms";
import { useRecoilState } from "recoil";
import ACTIONS from "../actions/Actions";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const [lang, setLang] = useRecoilState(language);
  const [them, setThem] = useRecoilState(cmtheme);

  const [clients, setClients] = useState([]);

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [filePreview, setFilePreview] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [socketEpoch, setSocketEpoch] = useState(0);
  const fileInputRef = useRef(null);
  const editorInstanceRef = useRef(null);

  const username = location.state?.username;

  useEffect(() => {
    if (!username || !roomId) return;

    let disposed = false;
    let socket = null;

    const handleErrors = () => {
      toast.error("Socket connection failed, try again later.");
      navigate("/");
    };

    const onJoined = ({ clients: nextClients, username: joinedName, socketId }) => {
      if (joinedName !== username) {
        toast.success(`${joinedName} joined the room.`);
      }
      setClients(nextClients);
      socketRef.current?.emit(ACTIONS.SYNC_CODE, {
        code: codeRef.current,
        socketId,
      });
    };

    const onDisconnected = ({ socketId, username: disconnectedUser }) => {
      toast.success(`${disconnectedUser} left the room.`);
      setClients((prev) => prev.filter((client) => client.socketId !== socketId));
    };

    (async () => {
      try {
        socket = await initSocket();
        if (disposed) {
          socket.disconnect();
          return;
        }
        socketRef.current = socket;
        setSocketEpoch((n) => n + 1);

        socket.on("connect_error", handleErrors);
        socket.on("connect_failed", handleErrors);

        socket.on(ACTIONS.JOINED, onJoined);
        socket.on(ACTIONS.DISCONNECTED, onDisconnected);

        socket.emit(ACTIONS.JOIN, {
          roomId,
          username,
        });
      } catch (e) {
        console.error("Socket init failed", e);
        handleErrors();
      }
    })();

    return () => {
      disposed = true;
      if (socket) {
        socket.off("connect_error", handleErrors);
        socket.off("connect_failed", handleErrors);
        socket.off(ACTIONS.JOINED, onJoined);
        socket.off(ACTIONS.DISCONNECTED, onDisconnected);
        socket.disconnect();
      }
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [roomId, username, navigate]);

  const copyRoomId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }, [roomId]);

  const leaveRoom = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const resetFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setFileContent(text);
        setFilePreview(true);
      }
    };
    reader.readAsText(file);
  }, []);

  const updateEditorCode = useCallback((newCode) => {
    editorInstanceRef.current?.setCode(newCode);
    codeRef.current = newCode;
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
  }, [roomId]);

  const handleAppendCode = useCallback(() => {
    const currentCode = codeRef.current || "";
    const appendedCode = currentCode ? `${currentCode}\n\n${fileContent}` : fileContent;
    updateEditorCode(appendedCode);
    setFilePreview(false);
    resetFileInput();
  }, [fileContent, resetFileInput, updateEditorCode]);

  const handleReplaceCode = useCallback(() => {
    updateEditorCode(fileContent);
    setFilePreview(false);
    resetFileInput();
  }, [fileContent, resetFileInput, updateEditorCode]);

  const onCodeChange = useCallback((code) => {
    codeRef.current = code;
  }, []);

  const onLanguageChange = useCallback(
    (e) => {
      setLang(e.target.value);
      window.location.reload();
    },
    [setLang]
  );

  const onThemeChange = useCallback(
    (e) => {
      setThem(e.target.value);
    },
    [setThem]
  );

  const onUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!location.state) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mainWrap">
      <EditorSidebar
        clients={clients}
        lang={lang}
        onLanguageChange={onLanguageChange}
        theme={them}
        onThemeChange={onThemeChange}
        fileInputRef={fileInputRef}
        onFileSelected={handleFileUpload}
        onUploadClick={onUploadClick}
        filePreviewOpen={filePreview}
        fileContent={fileContent}
        onCloseFilePreview={() => setFilePreview(false)}
        onAppendFile={handleAppendCode}
        onReplaceFile={handleReplaceCode}
        resetFileInput={resetFileInput}
        onCopyRoomId={copyRoomId}
        onLeaveRoom={leaveRoom}
      />

      <div className="editorWrap">
        <Editor
          ref={editorInstanceRef}
          socketRef={socketRef}
          socketEpoch={socketEpoch}
          roomId={roomId}
          onCodeChange={onCodeChange}
        />
      </div>
    </div>
  );
};

export default EditorPage;
