// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import "videojs-contrib-quality-levels";
import "@videojs/http-streaming";
import "videojs-http-source-selector";

//const source = "http://localhost:8080/bourne/playlist.m3u8";
// const source = "bourne/playlist.m3u8";

type PropType = {
  source: string;
};

const App = ({ source }: PropType) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState<videojs.Player | null>(null);

  useEffect(() => {
    if (player) {
      player.httpSourceSelector();
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      player.src(source);
    }
  },[player,source]);

  useEffect(() => {
    const videoJsOptions: videojs.PlayerOptions = {
      preload: "auto",
      autoplay: false,
      controls: true,
      fluid: true,
      responsive: true,
      sources: [
        {
          src: source,
        },
      ],
    };
    const p = videojs(
      videoRef.current,
      videoJsOptions,
      function onPlayerReady() {
        // console.log('onPlayerReady');
      }
    );
    setPlayer(p);
    return () => {
      if (player) player.dispose();
    };
  }, [source, player]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered"
      ></video>
    </div>
  );
};

export default App;
