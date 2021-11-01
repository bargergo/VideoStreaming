import React, { useCallback, useContext, useEffect, useState } from 'react';
import HttpServiceContext from '../../misc/HttpServiceContext';
import { VideoInfo } from '../../models/VideoInfo';
import VideoListElement from '../Shared/VideoListElement/VideoListElement';

const MyListPage = () => {

  const httpService = useContext(HttpServiceContext);

  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getMyVideos = useCallback(
    () => {
      setLoading(true);
      httpService.getVideoInfosForUser()
      .then(results => {
        setVideos(results);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
    },
    [httpService]
  );

  useEffect(() => {
    getMyVideos();
    return;
  }, [getMyVideos]);

  return (
    <div className="container">
    <div className="row">
      {isLoading
        ? (<div className="container">
            <div className="d-flex justify-content-center">
              <div className="spinner-border m-5" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>)
        : videos.length === 0
          ? (<p>Your video list is empty. Add videos to your list with the 'Add to list' button.</p>)
          : videos.map(video => 
            <div className="col-4 mb-4" key={video.id}>
              <VideoListElement
                title={video.name}
                description={video.description} 
                url={`/videos/${video.fileId}`}
                imageUrl={video.imageFileName ? `/api/catalog/${video.fileId}/image` : null} 
                id={video.id}
                addedToList={true}
                onListChanged={getMyVideos} />
            </div>
        )}
    </div>
  </div>
  );
};

export default MyListPage;