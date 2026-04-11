import React from "react";
import Client from "./Client";
import FilePreview from "./FilePreview";
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "../constants/editorOptions";

const EditorSidebar = ({
  clients,
  lang,
  onLanguageChange,
  theme,
  onThemeChange,
  fileInputRef,
  onFileSelected,
  onUploadClick,
  filePreviewOpen,
  fileContent,
  onCloseFilePreview,
  onAppendFile,
  onReplaceFile,
  resetFileInput,
  onCopyRoomId,
  onLeaveRoom,
}) => {
  return (
    <aside className="aside">
      <div className="asideInner">
        <div className="logo">
          <img className="logoImage" src="/logo.png" alt="CollabCode" />
        </div>
        <h3 className="sidebarSectionTitle">Connected</h3>
        <div className="clientsList">
          {clients.length === 0 ? (
            <p className="clientsEmpty">Waiting for peers…</p>
          ) : (
            clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))
          )}
        </div>
      </div>

      <div className="asideActions">
        <input
          ref={fileInputRef}
          type="file"
          accept=".js,.py,.java,.cpp,.c,.txt,.html,.css"
          className="visuallyHidden"
          onChange={onFileSelected}
        />
        <button type="button" className="uploadFileBtn" onClick={onUploadClick}>
          Upload file
        </button>

        {filePreviewOpen && (
          <FilePreview
            onClose={onCloseFilePreview}
            fileContent={fileContent}
            resetFileInput={resetFileInput}
            onAppend={onAppendFile}
            onReplace={onReplaceFile}
          />
        )}

        <label className="sidebarField">
          <span className="fieldLabel">Language</span>
          <select
            value={lang}
            onChange={onLanguageChange}
            className="seLang"
            aria-label="Editor language"
          >
            {LANGUAGE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="sidebarField">
          <span className="fieldLabel">Editor theme</span>
          <select
            value={theme}
            onChange={onThemeChange}
            className="seLang"
            aria-label="CodeMirror theme"
          >
            {THEME_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="btn copyBtn" onClick={onCopyRoomId}>
          Copy room ID
        </button>
        <button type="button" className="btn leaveBtn" onClick={onLeaveRoom}>
          Leave room
        </button>
      </div>
    </aside>
  );
};

export default EditorSidebar;
