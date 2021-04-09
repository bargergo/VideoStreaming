import React, { useEffect, useRef, useState } from "react";
import * as tus from "tus-js-client";

const UploadPage = () => {
  const videoInput = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!!videoInput.current) {
      videoInput.current.onchange = function (e: Event) {
        // Get the selected file from the input element
        if (!!e) {
          const file = (e.target as HTMLInputElement)?.files![0];

          // Create a new tus upload
          var upload = new tus.Upload(file, {
            endpoint: "/files",
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
              filename: file.name,
              filetype: file.type,
            },
            onError: function (error) {
              setMessage("Failed because: " + error);
            },
            onProgress: function (bytesUploaded, bytesTotal) {
              setProgress((bytesUploaded / bytesTotal) * 100);
            },
            onSuccess: function () {
              setMessage(`Download ${(upload.file as File).name} from ${upload.url}`);
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
      { progress !== null ? <p>{progress.toFixed(2)}%</p> : undefined}
      { message !== null ? <p>{message}%</p> : undefined}
    </div>
  );
};

export default UploadPage;
