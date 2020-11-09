import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/EditProfileStyles/ContainerEditProfile.scss";
import axios from "axios";
import { backend } from "../../conf.js";
import Profile from "./Profile";
import Links from "./Links";
import Role from "./Role";
import Games from "./Games";

export default function ContainerEditProfile() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const user_id = useSelector(state => state.user_id);

  useEffect(() => {
    axios
      .get(`${backend}/api/profile/${user_id}`)
      .then(({ data }) => {
        dispatch({ type: "SAVE_PROFILE_DATA", value: data[0] });
      })
      .catch(err => {});
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    axios
      .put(`${backend}/api/user/`, user)
      .then(() => {
        toast("Succesfully saved your data " + user.pseudo);
      })
      .catch();
  };

  return (
    <div className="ContainerEditProfile">
      <ul className="editNav">
        <li>
          <Link to="/editprofile">Profil</Link>
        </li>
        <li>
          <Link to="/editprofile/role">Rôle</Link>
        </li>
        <li>
          <Link to="/editprofile/links">Liens</Link>
        </li>
        <li>
          <Link to="/editprofile/games">Jeux favoris</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path="/editprofile">
          <Profile />
        </Route>
        <Route path="/editprofile/role">
          <Role />
        </Route>
        <Route path="/editprofile/links">
          <Links />
        </Route>
        <Route path="/editprofile/games">
          <Games />
        </Route>
      </Switch>
      <div className="submit">
        <button onClick={onSubmit}>Valide tes modifications</button>
      </div>
    </div>
  );
}
