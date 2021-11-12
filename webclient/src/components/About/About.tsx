import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => {
  return (
    <Container>
      <h1 className="mb-4">About</h1>
      <p>
        VideoStreaming is a web application for streaming videos with HLS.
        The application is implemented in microservices architecture.
        The signed in users can upload videos.
        The videos are converted to HLS streams with FFmpeg.
        Users can add videos to their list, and their progress with playing the video is saved, so the video playback can be resumed.
      </p>
      <h2 className="mb-2">Used Technologies</h2>
      <p>React, TypeScript, C#, ASP.NET Core, Spring, Kotlin, Docker, RabbitMQ, Traefik, FFmpeg, HLS.js, Plyr</p>
      <h2 className="mb-2">Author</h2>
      <p>Bargergo</p>
    </Container>);
    

};

export default About;