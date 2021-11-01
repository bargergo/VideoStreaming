import React from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router";
import Home from "./components/Home/Home";
import LoginPage from "./components/LoginPage/LoginPage";
import MyListPage from "./components/MyListPage/MyListPage";
import Navs from "./components/Navigation/Navs";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import UploadPage from "./components/UploadPage/UploadPage";
import VideoEditPage from "./components/VideoEditPage/VideoEditPage";
import VideoPage from "./components/VideoPage/VideoPage";
import VideosPage from "./components/VideosPage/VideosPage";
import HttpServiceContext, { HttpService } from "./misc/HttpServiceContext";

const App = () => {

  return (
    <HttpServiceContext.Provider value={new HttpService()}>
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

        <Route path="/my-list">
          <MyListPage />
        </Route>

        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/register">
          <RegisterPage />
        </Route>

        <Route>
          <div>
            Not found
          </div>
        </Route>
      </Switch>
      </Container>

    </HttpServiceContext.Provider>
  );
};

export default App;