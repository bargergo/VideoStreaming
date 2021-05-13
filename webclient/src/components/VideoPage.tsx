import videojs from "video.js";
import "video.js/dist/video-js.css";

import "videojs-http-source-selector";
import "videojs-contrib-quality-levels";
import "@videojs/http-streaming";

import '../extensions'
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

type VideoParams = {
  id: string;
};

const VideoPage = () => {

  const video = useRef<HTMLVideoElement>(null);
  const { id } = useParams<VideoParams>();
  const source = `/api/files/${id}/playlist.m3u8`;

  const [player, setPlayer] = useState<videojs.Player | null>(null);

  useEffect(() => {
    const videoJsOptions: videojs.PlayerOptions = {
      preload: "auto",
      autoplay: false,
      controls: true,
      fluid: true,
      sources: [
        {
          src: source,
        },
      ],
    };
    const p = videojs(
      video.current,
      videoJsOptions,
      function onPlayerReady() {
        // console.log('onPlayerReady');
      }
    );
    p.httpSourceSelector();
    setPlayer(p);
    return () => {
      if (player) player.dispose();
    };
  }, [player, source]);

  return (
    <div data-vjs-player>
      <video
        ref={video}
        className="video-js vjs-default-skin vjs-big-play-centered"
      ></video>
    </div>
  );
};

export default VideoPage;
