import React, { ChangeEvent, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Link } from "react-router-dom";
import * as tus from "tus-js-client";
import "./UploadPage.css";

enum Severity {
  ERROR = "danger",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success",
}

interface Message {
  severity: Severity;
  text: string;
}

const UploadPage = ({ token }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileInputChanged = (e: ChangeEvent) => {
    if (e != null) {
      const selectedFiles = (e.target as HTMLInputElement).files;
      if (selectedFiles != null && selectedFiles.length > 0) {
        setFile(selectedFiles[0]);
        setFileId(null);
        setProgress(null);
        setMessage(null);
      }
    }
  };

  const onStartUpload = () => {
    // Get the selected file from the input element
    if (file != null) {
      // Create a new tus upload
      var upload = new tus.Upload(file, {
        endpoint: "/api/files",
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        headers: {
          Authorization: token != null ? `Bearer ${token}` : null,
        },
        onError: function (error) {
          const responseCode = error.message.match(
            /(?!response code: )[0-9]{3}(?=,)/
          )[0];
          const text =
            responseCode === "401"
              ? "You have to be logged in to upload files."
              : "Failed because: " + error;
          setMessage({
            severity: Severity.ERROR,
            text: text,
          });
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percent = (bytesUploaded / bytesTotal) * 100;
          setProgress(percent);
          const megabytesUploaded = bytesUploaded / 1024 / 1024;
          const megabytesTotal = bytesTotal / 1024 / 1024;
          setMessage({
            severity: Severity.INFO,
            text: `Uploaded ${megabytesUploaded.toFixed(
              1
            )} MB of ${megabytesTotal.toFixed(1)} MB (${percent.toFixed(2)}%)`,
          });
        },
        onSuccess: function () {
          setMessage({
            severity: Severity.SUCCESS,
            text: `Go to video '${(upload.file as File).name}'`,
          });
          if (upload.url != null) {
            setFileId(upload.url.substring(upload.url.lastIndexOf("/") + 1));
          }
        },
        onBeforeRequest: function () {
          setMessage(null);
        },
      });

      // Check if there are any previous uploads to continue.
      upload.findPreviousUploads().then(function (previousUploads) {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        // Start the upload
        upload.start();
      });
    }
  };

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const isAnimated = progress != null && progress !== 100;

  const successMessage =
    fileId != null && message != null ? (
      <Alert variant={message.severity}>
        <div>
          File uploaded. You can watch the video{" "}
          <Link to={`/videos/${fileId}`}>here</Link> after it is converted.
        </div>
      </Alert>
    ) : null;

  const errorMessage =
    message != null ? (
      <Alert variant={message.severity}>{message.text}</Alert>
    ) : null;

  const uploadButton =
    file != null ? (
      <button className="btn btn-outline-primary" onClick={onStartUpload}>
        Upload
      </button>
    ) : null;

  return (
    <>
      <h1 className="mb-4">Upload</h1>
      {successMessage || errorMessage}
      <label className="mr-3">Choose a video file: </label>
      <input
        className="d-none"
        type="file"
        ref={inputRef}
        accept="video/mp4"
        onChange={onFileInputChanged}
      />
      <div>
        <button
          className={`btn btn-outline-${file != null ? "success" : "primary"}`}
          onClick={handleBrowse}
        >
          {file != null ? file.name : "Browse"}
        </button>{" "}
        {uploadButton}
      </div>
      {progress != null ? (
        <div className="mt-3">
          <ProgressBar animated={isAnimated} now={progress} />
        </div>
      ) : null}
    </>
  );
};

export default UploadPage;
