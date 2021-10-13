import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as tus from "tus-js-client";
import ProgressBar from 'react-bootstrap/ProgressBar'
import './UploadPage.css';
import { Alert } from "react-bootstrap";

enum Severity {
  ERROR = "danger",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success"
}

interface Message {
  severity: Severity;
  text: string;
}

const UploadPage = () => {
  const videoInput = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  useEffect(() => {
    if (!!videoInput.current) {
      videoInput.current.onchange = function (e: Event) {
        setFileId(null);
        setProgress(null);
        setMessage(null);

        // Get the selected file from the input element
        if (!!e) {
          const file = (e.target as HTMLInputElement)?.files![0];

          // Create a new tus upload
          var upload = new tus.Upload(file, {
            endpoint: "/api/files",
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
              filename: file.name,
              filetype: file.type,
            },
            onError: function (error) {
              setMessage({
                severity: Severity.ERROR,
                text: "Failed because: " + error
              });
            },
            onProgress: function (bytesUploaded, bytesTotal) {
              const percent = (bytesUploaded / bytesTotal) * 100;
              setProgress(percent);
              const megabytesUploaded = bytesUploaded / 1024 / 1024;
              const megabytesTotal = bytesTotal / 1024 / 1024;
              setMessage({
                severity: Severity.INFO,
                text: `Uploaded ${megabytesUploaded.toFixed(1)} MB of ${megabytesTotal.toFixed(1)} MB (${percent.toFixed(2)}%)`
              });
            },
            onSuccess: function () {
              setMessage({
                severity: Severity.SUCCESS,
                text: `Go to video '${(upload.file as File).name}'`
              });
              if (upload.url != null) {
                setFileId(upload.url.substring(upload.url.lastIndexOf("/") + 1));
              }
            },
            onBeforeRequest: function () {
              setMessage(null);
            }
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
    }
  });

  const isAnimated = progress != null && progress !== 100;

  const successMessage = fileId != null && message != null ? (
    <Alert variant={message.severity}>
      <Link to={`/videos/${fileId}`}>{message.text}</Link>
    </Alert>) : null;

  const errorMessage = message != null ? (
    <Alert variant={message.severity}>
      {message.text}
    </Alert>) : null;

  return (
    <div>
      { successMessage || errorMessage }
      <label htmlFor="video-file-input">Choose a video file:</label>
      <input
        ref={videoInput}
        type="file"
        id="video-file-input"
        name="video-file-input"
        accept="video/mp4"
      />
      { progress != null ? <ProgressBar animated={isAnimated} now={progress} /> : undefined}
    </div>
  );
};

export default UploadPage;
