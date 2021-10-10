import React, { useEffect, useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom';

interface VideoInfo {
  id: number;
  fileId: string;
  name: string;
  description: string;
  status: string;
}

async function getVideoInfos(): Promise<VideoInfo[]> {
  const response = await fetch("/api/catalog")
    .then(r => r.json());
  return response;
}

const VideosPage = () => {

  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const match = useRouteMatch();

  useEffect(() => {
    getVideoInfos()
      .then(results => {
        setVideos(results);
      })
      .catch(err => {
        console.log(err);
      });
    return;
  }, [])

  return (
    <div>
      This is Videos Page!
      <ul>
        {videos.map(video => <li key={video.id}><Link to={`${match.url}/${video.fileId}`}>{video.name}</Link></li>)}
      </ul>
    </div>
  )
}

export default VideosPage
