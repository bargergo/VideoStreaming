import React from "react";
import { Container } from "react-bootstrap";
import { Redirect, Route, Switch } from "react-router";
import About from "./components/About/About";
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
            <Redirect to="/videos" />
          </Route>

          <Route path="/videos/:id/edit">
            {token == null
              ? <Redirect to="/login" />
              : <VideoEditPage />
            }
          </Route>

          <Route path="/videos/:id">
            <VideoPage />
          </Route>

          <Route path="/videos">
            <VideosPage />
          </Route>

          <Route path="/upload">
            {token == null
              ? <Redirect to="/login" />
              : <UploadPage token={token}/>
            }
          </Route>

          <Route path="/my-list">
            {token == null
              ? <Redirect to="/login" />
              : <MyListPage />
            }
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

          <Route>
            <Container>
              <h1 className="mb-4">Not found</h1>
              <div>
                The requested page was not found.
              </div>
            </Container>
          </Route>
        </Switch>
        </Container>
      </UserContext.Provider>
    </HttpServiceContext.Provider>
  );
};

export default App;