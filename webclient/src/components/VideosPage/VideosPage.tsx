import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useRouteMatch } from 'react-router-dom';
import { checkVideoIdsForUserList, getVideoInfos, searchVideos } from '../../misc/api';
import { useAppDispatch, useAppSelector } from '../../misc/store-hooks';
import { logoutAction } from '../../misc/userSlice';
import { HttpStatusError } from '../../models/HttpStatusError';
import { ValidationErrorResponse } from '../../models/ValidationErrorResponse';
import { VideoInfo } from '../../models/VideoInfo';
import { VideoInfoEx } from '../../models/VideoInfoEx';
import VideoListElement from '../Shared/VideoListElement/VideoListElement';
import SearchForm from './SearchForm';

const VideosPage = () => {
  
  const token = useAppSelector((state) => state.user.token);
  const [videos, setVideos] = useState<VideoInfoEx[]>([]);
  const match = useRouteMatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const search = async (searchText: string) => {
    setErrors([]);
    setLoading(true);
    try {
      const response = await searchVideos({searchText: searchText});
      if (response['errors'] == null) {
        const castedResponse = response as VideoInfo[];
        const videosOnList = token != null
          ? await checkVideoIdsForUserList({videoIds: castedResponse.map(r => r.id)})
          : [];
        const result = castedResponse.map<VideoInfoEx>(video => ({
          ...video,
          addedToList: videosOnList.includes(video.id)
        }));
        setVideos(result);
      } else {
        const castedResponse = response as ValidationErrorResponse;
        const validationErrors = [];
        for (const key in castedResponse.errors) {
          validationErrors.push(...castedResponse.errors[key]);
        }
        setErrors(validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const showAll = useCallback(
    async () => {
      try {
        setErrors([]);
        setLoading(true);
        const response = await getVideoInfos();
        const videosOnList = token != null
        ? await checkVideoIdsForUserList({videoIds: response.map(r => r.id)})
        : [];
        const result = response.map<VideoInfoEx>(video => ({
          ...video,
          addedToList: videosOnList.includes(video.id)
        }));
        setVideos(result);
      } catch(e: any) {
        if (e instanceof HttpStatusError) {
          if (e.statusCode === 401) {
            dispatch(logoutAction());
          } else {
            console.log(e);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [token, dispatch],
  );

  const updateMyList = async () => {
    setErrors([]);
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
    return () =>{};
  }, [showAll]);

  return (
    <div className="container">
      <div>
        <SearchForm onSearch={(text) => search(text)} onShowAll={showAll} />
      </div>
      <div>
        {errors.map((errorMessage, idx) => (
          <Alert variant="danger" key={idx}>
            {errorMessage}
          </Alert>
        ))}
        {isLoading ? (
          <div className="container">
            <div className="d-flex justify-content-center">
              <div className="spinner-border m-5" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <p>No videos found</p>
        ) : (
          <div className="row">
            {videos.map((video) => (
              <div className="col-md-4 mb-4" key={video.id}>
                <VideoListElement
                  title={video.name}
                  description={video.description}
                  url={`${match.url}/${video.id}`}
                  imageUrl={
                    video.imageFileName
                      ? `/api/catalog/public/${video.id}/image`
                      : null
                  }
                  id={video.id}
                  addedToList={video.addedToList}
                  onListChanged={token != null ? updateMyList : null}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideosPage;

