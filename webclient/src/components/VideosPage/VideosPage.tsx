import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import HttpServiceContext from '../../misc/HttpServiceContext';
import { VideoInfoEx } from '../../models/VideoInfoEx';
import VideoListElement from '../Shared/VideoListElement/VideoListElement';
import SearchForm from './SearchForm';

const VideosPage = () => {
  
  const httpService = useContext(HttpServiceContext);
  const [videos, setVideos] = useState<VideoInfoEx[]>([]);
  const match = useRouteMatch();
  const [isLoading, setLoading] = useState<boolean>(false);

  const search = async (searchText: string) => {
    setLoading(true);
    try {
      const response = await httpService.searchVideos({searchText: searchText});
      const videosOnList = await httpService.checkVideoIdsForUserList({videoIds: response.map(r => r.id)});
      const result = response.map<VideoInfoEx>(video => ({
        ...video,
        addedToList: videosOnList.includes(video.id)
      }));
      setVideos(result);
    } finally {
      setLoading(false);
    }
  };

  const showAll = useCallback(
    () => {
      setLoading(true);
      httpService.getVideoInfos()
      .then(async (response) => {
        const videosOnList = await httpService.checkVideoIdsForUserList({videoIds: response.map(r => r.id)});
        const result = response.map<VideoInfoEx>(video => ({
          ...video,
          addedToList: videosOnList.includes(video.id)
        }));
        setVideos(result);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
    },
    [httpService],
  );

  const updateMyList = async () => {
    setLoading(true);
    try {
      const videosOnList = await httpService.checkVideoIdsForUserList({videoIds: videos.map(r => r.id)});
      setVideos(prev => {
        const result = prev.map<VideoInfoEx>(video => ({
          ...video,
          addedToList: videosOnList.includes(video.id)
        }));
        return result;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showAll();
    return;
  }, [showAll]);

  return (
    <div className="container">
      <div>
        <SearchForm onSearch={(text) => search(text)} onShowAll={showAll}/>
      </div>
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
            ? (<p>No videos found</p>)
            : videos.map(video => 
              <div className="col-4 mb-4" key={video.id}>
                <VideoListElement
                  title={video.name}
                  description={video.description} 
                  url={`${match.url}/${video.fileId}`}
                  imageUrl={video.imageFileName ? `/api/catalog/${video.fileId}/image` : null} 
                  id={video.id}
                  addedToList={video.addedToList}
                  onListChanged={updateMyList} />
            </div>
          )}
      </div>
    </div>
  )
}

export default VideosPage;

