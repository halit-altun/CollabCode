import React, { useEffect, useRef, useImperativeHandle } from "react";
import { language, cmtheme } from "../atoms";
import { useRecoilValue } from "recoil";
import ACTIONS from "../actions/Actions";

// CODE MIRROR
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";

// theme
import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/abbott.css";
import "codemirror/theme/abcdef.css";
import "codemirror/theme/ambiance.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/theme/base16-dark.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/bespin.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/colorforth.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/duotone-dark.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/elegant.css";
import "codemirror/theme/erlang-dark.css";
import "codemirror/theme/gruvbox-dark.css";
import "codemirror/theme/hopscotch.css";
import "codemirror/theme/icecoder.css";
import "codemirror/theme/idea.css";
import "codemirror/theme/isotope.css";
import "codemirror/theme/juejin.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/theme/liquibyte.css";
import "codemirror/theme/lucario.css";
import "codemirror/theme/material.css";
import "codemirror/theme/material-darker.css";
import "codemirror/theme/material-palenight.css";
import "codemirror/theme/material-ocean.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/mdn-like.css";
import "codemirror/theme/midnight.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/moxer.css";
import "codemirror/theme/neat.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/night.css";
import "codemirror/theme/nord.css";
import "codemirror/theme/oceanic-next.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/theme/paraiso-dark.css";
import "codemirror/theme/paraiso-light.css";
import "codemirror/theme/pastel-on-dark.css";
import "codemirror/theme/railscasts.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/shadowfox.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/the-matrix.css";
import "codemirror/theme/tomorrow-night-bright.css";
import "codemirror/theme/tomorrow-night-eighties.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/twilight.css";
import "codemirror/theme/vibrant-ink.css";
import "codemirror/theme/xq-dark.css";
import "codemirror/theme/xq-light.css";
import "codemirror/theme/yeti.css";
import "codemirror/theme/yonce.css";
import "codemirror/theme/zenburn.css";

// modes
import "codemirror/mode/clike/clike";
import "codemirror/mode/css/css";
import "codemirror/mode/dart/dart";
import "codemirror/mode/django/django";
import "codemirror/mode/dockerfile/dockerfile";
import "codemirror/mode/go/go";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/php/php";
import "codemirror/mode/python/python";
import "codemirror/mode/r/r";
import "codemirror/mode/rust/rust";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/sass/sass";
import "codemirror/mode/shell/shell";
import "codemirror/mode/sql/sql";
import "codemirror/mode/swift/swift";
import "codemirror/mode/xml/xml";
import "codemirror/mode/yaml/yaml";

// features
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/scroll/simplescrollbars.css";

//search
import "codemirror/addon/search/search.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/jump-to-line.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";

const Editor = React.forwardRef(({ socketRef, roomId, onCodeChange, socketEpoch }, ref) => {
  const editorRef = useRef(null);
  const lang = useRecoilValue(language);
  const editorTheme = useRecoilValue(cmtheme);
  const onCodeChangeRef = useRef(onCodeChange);
  const roomIdRef = useRef(roomId);

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useImperativeHandle(ref, () => ({
    setCode: (code) => {
      editorRef.current?.setValue(code);
    },
  }));

  useEffect(() => {
    const textarea = document.getElementById("collabCodeEditor");
    if (!textarea) return undefined;

    const cm = Codemirror.fromTextArea(textarea, {
      mode: { name: lang },
      theme: editorTheme,
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });
    editorRef.current = cm;

    const onLocalChange = (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChangeRef.current(code);
      if (origin !== "setValue" && socketRef.current) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId: roomIdRef.current,
          code,
        });
      }
    };

    cm.on("change", onLocalChange);

    return () => {
      cm.off("change", onLocalChange);
      cm.toTextArea();
      editorRef.current = null;
    };
  }, [lang, socketRef]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setOption("theme", editorTheme);
    }
  }, [editorTheme]);

  useEffect(() => {
    if (!socketEpoch) return undefined;
    const socket = socketRef.current;
    if (!socket) return undefined;

    const onRemoteCode = ({ code }) => {
      if (code == null || !editorRef.current) return;
      const local = editorRef.current.getValue();
      if (code !== local) {
        editorRef.current.setValue(code);
      }
    };

    socket.on(ACTIONS.CODE_CHANGE, onRemoteCode);
    return () => {
      socket.off(ACTIONS.CODE_CHANGE, onRemoteCode);
    };
  }, [socketEpoch, socketRef]);

  return <textarea id="collabCodeEditor" defaultValue="" spellCheck="false" />;
});

Editor.displayName = "Editor";

export default Editor;
