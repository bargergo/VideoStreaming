import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as tus from "tus-js-client";
import ProgressBar from 'react-bootstrap/ProgressBar'
import './UploadPage.css';

const UploadPage = () => {
  const videoInput = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!!videoInput.current) {
      videoInput.current.onchange = function (e: Event) {
        setDownloadUrl(null);
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
              setMessage("Failed because: " + error);
            },
            onProgress: function (bytesUploaded, bytesTotal) {
              const percent = (bytesUploaded / bytesTotal) * 100;
              setProgress(percent);
              const megabytesUploaded = bytesUploaded / 1024 / 1024;
              const megabytesTotal = bytesTotal / 1024 / 1024;
              setMessage(`Uploaded ${megabytesUploaded.toFixed(1)} MB of ${megabytesTotal.toFixed(1)} MB (${percent.toFixed(2)}%)`);
            },
            onSuccess: function () {
              setMessage(`Download ${(upload.file as File).name}`);
              setDownloadUrl(upload.url);
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

  const isAnimated = progress !== null && progress !== 100;

  console.log('message', message);

  return (
    <div>
      <label htmlFor="video-file-input">Choose a video file:</label>
      <input
        ref={videoInput}
        type="file"
        id="video-file-input"
        name="video-file-input"
        accept="video/mp4"
      />
      { progress !== null ? <ProgressBar animated={isAnimated} now={progress} /> : undefined}
      { message !== null
        ? downloadUrl !== null
          ? <p><Link to={downloadUrl}>{message}</Link></p> : <p>{message}</p>
        : undefined}
    </div>
  );
};

export default UploadPage;
