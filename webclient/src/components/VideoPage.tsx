import Hls from "hls.js";
import Plyr from "plyr";
import 'plyr/dist/plyr.css';
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";
import './VideoPage.css';

type VideoParams = {
  id: string;
};

//const source = "http://localhost:8080/bourne/playlist.m3u8";
//const source = "bourne/playlist.m3u8";
//const source = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
const hls = new Hls();

const VideoPage = () => {

  const video = useRef<HTMLVideoElement>(null);
  const { id } = useParams<VideoParams>();
  const source = `/api/files/${id}/playlist.m3u8`;

  const updateQuality = (newQuality: number) => {
      hls.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          console.log("Found quality match with " + newQuality);
          hls.currentLevel = levelIndex;
        }
      });
  };

  useEffect(() => {
    
    // For more options see: https://github.com/sampotts/plyr/#options
    // captions.update is required for captions to work with hls.js
    const defaultOptions: Plyr.Options = {};
  
    if (video.current) {

      if (!Hls.isSupported()) {
        video.current.src = source;
      } else {
        // For more Hls.js options, see https://github.com/dailymotion/hls.js
        hls.loadSource(source);
    
        // From the m3u8 playlist, hls parses the manifest and returns
        // all available video qualities. This is important, in this approach,
        // we will have one source on the Plyr player.
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    
          // Transform available levels into an array of integers (height values).
          const availableQualities = [-1, ...hls.levels.map((l) => l.height)];
    
          // Add new qualities to option
          defaultOptions.quality = {
            default: availableQualities[0],
            options: availableQualities,
            // this ensures Plyr to use Hls to update quality level
            forced: true,        
            onChange: (e) => updateQuality(e),
          }
          new Plyr(video.current!!, defaultOptions);
          hls.attachMedia(video.current!!);
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
          const span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='-1'] span")
          if (hls.autoLevelEnabled) {
            span!!.innerHTML = `AUTO (${hls.levels[data.level].height}p)`
          } else {
            span!!.innerHTML = `AUTO`
          }
        })
        
      }
    }
    return () => {
    };
  }, [video]);

  return (
    <div className="container">
      Try adjust different video quality to see it yourself
      <video className="plyr" ref={video} controls crossOrigin="true" playsInline >
      </video>
    </div>
  );
};

export default VideoPage;
