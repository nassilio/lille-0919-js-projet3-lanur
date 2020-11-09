import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import NavBar from "./components/NavBar";
import Carousel from "./components/Carousel";
import SignIn from "./components/SignIn";
import NewsFeed from "./components/NewsFeed";
import SearchResult from "./components/SearchResult";
import UserPage from "./components/UserPage";
import ContainerEditProfile from "./components/EditProfile/ContainerEditProfile";
import Teams from "./components/Teams";
import Discover from "./components/Discover";
import "react-toastify/dist/ReactToastify.css";
import "./components/style/ToastContainer.scss";

function App() {
  const jwt = useSelector(state => state.jwt);
  const checkJWT = component => (jwt ? component : <Redirect to="/signin" />);

  useEffect(() => {
    if (jwt) axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
  }, [jwt]);

  return (
    <div className="App">
      <NavBar />
      <Switch>
        <Route exact path="/" component={Carousel} />
        <Route exact path="/signin" component={SignIn} />
        <Route path="/newsfeed" render={() => checkJWT(<NewsFeed />)} />
        <Route path="/discover" component={Discover} />
        <Route path="/teams" component={Teams} />
        <Route path="/search" component={SearchResult} />
        <Route path="/userpage/:id" render={() => checkJWT(<UserPage />)} />
        <Route
          path="/editprofile"
          render={() => checkJWT(<ContainerEditProfile />)}
        />
      </Switch>
      <ToastContainer
        position="bottom-left"
        hideProgressBar={true}
        autoClose={5000}
      />
    </div>
  );
}

export default App;
