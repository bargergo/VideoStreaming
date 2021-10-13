import Hls from "hls.js";
import Plyr from "plyr";
import 'plyr/dist/plyr.css';
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { deleteVideo, fetchVideoInfo } from "../../misc/api-calls";
import { VideoInfo } from "../../models/VideoInfo";
import './VideoPage.css';

type VideoParams = {
  id: string;
};

//const source = "http://localhost:8080/bourne/playlist.m3u8";
//const source = "bourne/playlist.m3u8";
//const source = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";

const VideoPage = () => {

  const video = useRef<HTMLVideoElement>(null);
  const { id } = useParams<VideoParams>();
  const source = `/api/catalog/${id}/playlist.m3u8`;
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const history = useHistory();
  const match = useRouteMatch();

  const goToEdit = () => {
    history.push(match.url + '/edit');
  };

  useEffect(() => {
    fetchVideoInfo(id)
      .then(result => {
        setVideoInfo(result);
      })
      .catch(err => {
        console.log(err);
      });
    return;
  }, [id]);

  useEffect(() => {

    const hls = new Hls();
    let plyr: Plyr | null = null;

    const updateQuality = (newQuality: number) => {
      if (newQuality === 0) {
        hls.currentLevel = -1; //Enable AUTO quality if option.value = 0
      } else {
        hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            console.log("Found quality match with " + newQuality);
            hls.currentLevel = levelIndex;
          }
        });
      }
    };
    
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
          const availableQualities = [0, ...hls.levels.map((l) => l.height)];
    
          // Add new qualities to option
          defaultOptions.quality = {
            default: availableQualities[0],
            options: availableQualities,
            // this ensures Plyr to use Hls to update quality level
            forced: true,        
            onChange: (e) => updateQuality(e),
          }
          plyr = new Plyr(video.current!!, defaultOptions);
          hls.attachMedia(video.current!!);
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
          // Replace 0p to AUTO
          const span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span")
          const span2 = document.querySelector(".plyr__control:not([hidden]) span span")
          if (hls.autoLevelEnabled) {
            span!!.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
            span2!!.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
          } else {
            span!!.innerHTML = `AUTO`;
          }
        })
        
      }
    }
    return () => {
      plyr.destroy();
      hls.destroy();
    };
  }, [video, source]);

  return (
    <div className="container">
      <h1 className="mb-4">{videoInfo?.name}</h1>
      <video className="plyr" ref={video} controls crossOrigin="true" playsInline />
      <div className="mt-4">
        <p>Status: {videoInfo?.status}</p>
        <div className="mb-2">Description: {videoInfo?.description}</div>
        <div className="mb-2">
          <Button variant="outline-primary" onClick={() => goToEdit()} >Edit</Button>{' '}
          <Button variant="danger" onClick={() => deleteVideo(id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
