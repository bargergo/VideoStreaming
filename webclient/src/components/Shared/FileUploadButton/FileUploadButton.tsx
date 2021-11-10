import React, { useRef } from 'react';

const FileUploadButton = ({text, accept, fileSelected, onFileInputChanged}) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        className="d-none"
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={onFileInputChanged}
      />
      <button
        type="button"
        className={`btn btn-outline-${fileSelected ? "success" : "primary"}`}
        onClick={handleBrowse}
      >
        {text}
      </button>
    </>
  );
};

export default FileUploadButton;