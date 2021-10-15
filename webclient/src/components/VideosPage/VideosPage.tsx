import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getVideoInfos, searchVideos } from '../../misc/api-calls';
import { VideoInfo } from '../../models/VideoInfo';
import SearchForm from './SearchForm';
import VideoListElement from './VideoListElement';

const VideosPage = () => {

  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const match = useRouteMatch();

  const search = async (searchText: string) => {
    const result = await searchVideos({searchText: searchText});
    setVideos(result);
  };

  const showAll = () => {
    getVideoInfos()
    .then(results => {
      setVideos(results);
    })
    .catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    showAll();
    return;
  }, []);

  return (
    <div className="container">
      <div>
        <SearchForm onSearch={(text) => search(text)} onShowAll={showAll}/>
      </div>
      <div className="row">
        {videos.length === 0
          ? (<p>No videos found</p>)
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
  )
}

export default VideosPage;

