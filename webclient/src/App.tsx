import React from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router";
import Home from "./components/Home/Home";
import Navs from "./components/Navigation/Navs";
import UploadPage from "./components/UploadPage/UploadPage";
import VideoEditPage from "./components/VideoEditPage/VideoEditPage";
import VideoPage from "./components/VideoPage/VideoPage";
import VideosPage from "./components/VideosPage/VideosPage";

const App = () => {

  return (
    <div>
      <Navs />

      <Container>
      <Switch>

        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/videos/:id/edit">
          <VideoEditPage />
        </Route>

        <Route path="/videos/:id">
          <VideoPage />
        </Route>

        <Route path="/videos">
          <VideosPage />
        </Route>

        <Route path="/upload">
          <UploadPage />
        </Route>

        <Route>
          <div>
            Not found
          </div>
        </Route>
      </Switch>
      </Container>

    </div>
  );
};

export default App;