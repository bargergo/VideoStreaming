import React from "react";
import { Container } from "react-bootstrap";
import { Redirect, Route, Switch } from "react-router";
import About from "./components/About/About";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import LoginPage from "./components/LoginPage/LoginPage";
import MyListPage from "./components/MyListPage/MyListPage";
import Navs from "./components/Navigation/Navs";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import UploadPage from "./components/UploadPage/UploadPage";
import VideoEditPage from "./components/VideoEditPage/VideoEditPage";
import VideoPage from "./components/VideoPage/VideoPage";
import VideosPage from "./components/VideosPage/VideosPage";
import { useAppSelector } from "./misc/store-hooks";

const App = () => {
  const token = useAppSelector((state) => state.user.token);

  return (
    <>
      <Navs />

      <Container>
        <Switch>
          <Route exact path="/">
            <Redirect to="/videos" />
          </Route>

          <Route path="/videos/:id/edit">
            {token == null ? <Redirect to="/login" /> : <VideoEditPage />}
          </Route>

          <Route path="/videos/:id">
            <VideoPage />
          </Route>

          <Route path="/videos">
            <VideosPage />
          </Route>

          <Route path="/upload">
            {token == null ? (
              <Redirect to="/login" />
            ) : (
              <UploadPage token={token} />
            )}
          </Route>

          <Route path="/my-list">
            {token == null ? <Redirect to="/login" /> : <MyListPage />}
          </Route>

          <Route path="/about">
            <About />
          </Route>

          <Route path="/login">
            <LoginPage />
          </Route>

          <Route path="/register">
            <RegisterPage />
          </Route>

          <Route path="/change-password">
            {token == null ? <Redirect to="/login" /> : <ChangePassword />}
          </Route>

          <Route>
            <Container>
              <h1 className="mb-4">Not found</h1>
              <div>The requested page was not found.</div>
            </Container>
          </Route>
        </Switch>
      </Container>
    </>
  );
};

export default App;
