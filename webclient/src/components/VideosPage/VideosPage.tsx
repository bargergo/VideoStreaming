import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { checkVideoIdsForUserList, getVideoInfos, searchVideos } from '../../misc/api';
import { useAppSelector } from '../../misc/store-hooks';
import { VideoInfoEx } from '../../models/VideoInfoEx';
import VideoListElement from '../Shared/VideoListElement/VideoListElement';
import SearchForm from './SearchForm';

const VideosPage = () => {
  
  const token = useAppSelector((state) => state.user.token);
  const [videos, setVideos] = useState<VideoInfoEx[]>([]);
  const match = useRouteMatch();
  const [isLoading, setLoading] = useState<boolean>(false);

  const search = async (searchText: string) => {
    setLoading(true);
    try {
      const response = await searchVideos({searchText: searchText});
      const videosOnList = token != null
        ? await checkVideoIdsForUserList({videoIds: response.map(r => r.id)})
        : [];
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
      getVideoInfos()
      .then(async (response) => {
        const videosOnList = token != null
          ? await checkVideoIdsForUserList({videoIds: response.map(r => r.id)})
          : [];
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
    [token],
  );

  const updateMyList = async () => {
    setLoading(true);
    try {
      const videosOnList = await checkVideoIdsForUserList({videoIds: videos.map(r => r.id)});
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
                  imageUrl={video.imageFileName ? `/api/catalog/public/${video.fileId}/image` : null} 
                  id={video.id}
                  addedToList={video.addedToList}
                  onListChanged={token != null ? updateMyList : null} />
            </div>
          )}
      </div>
    </div>
  )
}

export default VideosPage;

