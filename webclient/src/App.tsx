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
import { useSessionStorage } from "./misc/custom-hooks";
import HttpServiceContext, { HttpService } from "./misc/HttpServiceContext";
import UserContext from "./misc/UserContext";

const App = () => {

  const [username, setUsername] = useSessionStorage('USERNAME');
  const [token, setToken] = useSessionStorage('TOKEN');

  return (
    <HttpServiceContext.Provider value={new HttpService(username, setUsername, token, setToken)}>
      <UserContext.Provider value={{token: token, user: username}}>
        <Navs username={username}/>

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
            <UploadPage token={token}/>
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
      </UserContext.Provider>
    </HttpServiceContext.Provider>
  );
};

export default App;