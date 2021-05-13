import React from "react";
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

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/video/:id">
          <VideoPage />
        </Route>

        <Route exact path="/video">
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
    </div>
  );
};

export default App;