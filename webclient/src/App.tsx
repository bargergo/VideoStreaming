import React from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router";
import Home from "./components/Home";
import Navs from "./components/Navs";
import UploadPage from "./components/UploadPage";
import VideoPage from "./components/VideoPage";
import VideosPage from "./components/VideosPage";

const App = () => {

  return (
    <div>
      <Navs />

      <Container>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/videos/:id">
          <VideoPage />
        </Route>

        <Route exact path="/videos">
          <VideosPage />
        </Route>

        <Route exact path="/upload">
          <UploadPage />
        </Route>

        {/* redirect to make file download from backend work */}
        <Route exact path="/api/files/:id" component={() => { 
          window.location.href = window.location.href + "#"; 
          return null;
        }}/>

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