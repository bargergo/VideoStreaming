import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { VideoInfo } from '../../models/VideoInfo';
import VideoListElement from '../Shared/VideoListElement/VideoListElement';

const MyListPage = () => {

  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const match = useRouteMatch();

  return (
    <div className="container">
    <div className="row">
      {videos.length === 0
        ? (<p>Your video list is empty. Add videos to your list with the 'Add to list' button.</p>)
        : videos.map(video => 
          <div className="col-4 mb-4" key={video.id}>
            <VideoListElement
              title={video.name}
              description={video.description} 
              url={`${match.url}/${video.fileId}`}
              imageUrl={video.imageFileName ? `/api/catalog/${video.fileId}/image` : null} />
          </div>
        )}
    </div>
  </div>
  );
};

export default MyListPage;