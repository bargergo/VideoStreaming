import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

interface VideInfo {
  id: number;
  fileId: string;
  name: string;
  description: string;
  status: string;
}

async function getVideoInfos(): Promise<VideInfo[]> {
  const response = await fetch("/api/catalog")
    .then(r => r.json());
  return response;
}

const VideosPage = () => {

  const [videos, setVideos] = useState<VideInfo[]>([]);

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
        {videos.map(video => <li key={video.id}><Link to={`video/${video.id}`}>{video.name}</Link></li>)}
      </ul>
    </div>
  )
}

export default VideosPage
