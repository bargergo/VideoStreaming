import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

interface VideInfo {
  id: string;
  title: string;
}

async function getVideoInfos(): Promise<VideInfo[]> {
  const response = await fetch("/api/files")
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
        {videos.map(video => <li key={video.id}><Link to={`video/${video.id}`}>{video.title}</Link></li>)}
      </ul>
    </div>
  )
}

export default VideosPage
