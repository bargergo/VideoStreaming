import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getVideoInfosForUser } from "../../misc/api";
import { useAppDispatch } from "../../misc/store-hooks";
import { logoutAction } from "../../misc/userSlice";
import { HttpStatusError } from "../../models/HttpStatusError";
import { VideoInfo } from "../../models/VideoInfo";
import VideoListElement from "../Shared/VideoListElement/VideoListElement";

const MyListPage = () => {

  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const getMyVideos = useCallback(async () => {
    try {
      setLoading(true);
      const results = await getVideoInfosForUser();
      setVideos(results);
    } catch (e: any) {
      if (e instanceof HttpStatusError) {
        if (e.statusCode === 401) {
          dispatch(logoutAction());
          history.push('login');
        } else {
          console.log(e);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [history, dispatch]);

  useEffect(() => {
    getMyVideos();
    return () => {};
  }, [getMyVideos]);

  return (
    <div className="container">
      <h1 className="mb-4">My List</h1>
      <div>
        {isLoading ? (
          <div className="container">
            <div className="d-flex justify-content-center">
              <div className="spinner-border m-5" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <p>
            Your video list is empty. Add videos to your list with the 'Add to
            list' button.
          </p>
        ) : (
          <div className="row">{
            videos.map((video) => (
              <div className="col-md-4 mb-4" key={video.id}>
                <VideoListElement
                  title={video.name}
                  description={video.description}
                  url={`/videos/${video.fileId}`}
                  imageUrl={
                    video.imageFileName
                      ? `/api/catalog/public/${video.fileId}/image`
                      : null
                  }
                  id={video.id}
                  addedToList={true}
                  onListChanged={getMyVideos}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
