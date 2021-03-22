import Hls from "hls.js";
import Plyr from "plyr";
import React, { useCallback, useEffect, useRef, useState } from "react";
import './App.css';

//const source = "http://localhost:8080/bourne/playlist.m3u8";
// const source = "bourne/playlist.m3u8";
const source = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";

const App = () => {

  const [_hls, setHls] = useState<Hls | null>(null);
  const video = useRef<HTMLVideoElement>(null);

  const updateQuality = useCallback(
    (newQuality: number) => {
      _hls!!.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          console.log("Found quality match with " + newQuality);
          _hls!!.currentLevel = levelIndex;
        }
      })
    }, [_hls]
  );

  useEffect(() => {
    
    // For more options see: https://github.com/sampotts/plyr/#options
    // captions.update is required for captions to work with hls.js
    const defaultOptions: Plyr.Options = {};
  
    if (video.current) {

      const player = new Plyr(video.current);

      if (!Hls.isSupported()) {
        video.current.src = source;
      } else {
        // For more Hls.js options, see https://github.com/dailymotion/hls.js
        const hls = new Hls();
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
          
        });
        hls.attachMedia(video.current);
        setHls(hls);
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
