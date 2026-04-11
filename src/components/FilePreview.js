import React from "react";

const FilePreview = ({
  fileContent,
  resetFileInput,
  onAppend,
  onReplace,
  onClose,
}) => {
  const handleCancel = () => {
    resetFileInput();
    onClose();
  };

  return (
    <div
      className="filePreview"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filePreviewTitle"
    >
      <div className="filePreviewContainer">
        <h3 id="filePreviewTitle">File preview</h3>
        <pre tabIndex={0}>
          <code>{fileContent}</code>
        </pre>
        <div className="filePreviewActions">
          <button type="button" className="filePreviewBtn filePreviewBtn--append" onClick={onAppend}>
            Append
          </button>
          <button type="button" className="filePreviewBtn filePreviewBtn--replace" onClick={onReplace}>
            Replace
          </button>
          <button type="button" className="filePreviewBtn filePreviewBtn--cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
