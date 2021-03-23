import Hls from "hls.js";
import Plyr from "plyr";
import React, { useCallback, useEffect, useRef, useState } from "react";
import './App.css';
import 'plyr/dist/plyr.css';

//const source = "http://localhost:8080/bourne/playlist.m3u8";
const source = "bourne/playlist.m3u8";
//const source = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";

const App = () => {

  const [hls, setHls] = useState<Hls>(new Hls());
  const video = useRef<HTMLVideoElement>(null);

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
          const availableQualities = hls.levels.map((l) => l.height)
    
          // Add new qualities to option
          defaultOptions.quality = {
            default: availableQualities[0],
            options: availableQualities,
            // this ensures Plyr to use Hls to update quality level
            forced: true,        
            onChange: (e) => updateQuality(e),
          }
          const player = new Plyr(video.current!!, defaultOptions);
          hls.attachMedia(video.current!!);
        });
        
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

export default App;
