// @ts-nocheck
import React, { useRef, useState, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// those imports are important
import qualitySelector from "videojs-hls-quality-selector";
import qualityLevels from "videojs-contrib-quality-levels";

//const source = "http://localhost:8080/bourne/playlist.m3u8";
// const source = "bourne/playlist.m3u8";

type PropType = {
  source: string;
};

const App = ({ source }: PropType) => {
  const videoRef = useRef();
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    if (player) {
      player.hlsQualitySelector({ displayCurrentQuality: true });
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      player.src([source]);
    }
  },[player,source]);

  useEffect(() => {
    const videoJsOptions = {
      preload: "auto",
      autoplay: "any",
      controls: true,
      fluid: true,
      responsive: true,
      sources: [
        {
          src: source,
        },
      ],
    };
    console.log("useEffect");
    videojs.registerPlugin("qualityLevels", qualityLevels);
    videojs.registerPlugin("hlsQualitySelector", qualitySelector);
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
  }, []);

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
