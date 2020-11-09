import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "../style/EditProfileStyles/EditLinks.scss";

const Links = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  return (
    <form className="links">
      <h1>Tes liens vers les autres réseaux</h1>
      <div>
        <div className="infoContainer">
          <label> Ta chaîne Twitch :</label>
          <input
            className="linkInput"
            type="link"
            placeholder="Your Twitch channel"
            value={user.twitch}
            onChange={e => {
              dispatch({
                type: "SAVE_PROFILE_DATA",
                value: { twitch: e.target.value }
              });
            }}
          />
        </div>
        <div className="infoContainer">
          <label>Ta chaîne Youtube : </label>
          <input
            className="linkInput"
            type="link"
            placeholder="Your Youtube channel"
            value={user.youtube}
            onChange={e => {
              dispatch({
                type: "SAVE_PROFILE_DATA",
                value: { youtube: e.target.value }
              });
            }}
          />
        </div>
        <div className="infoContainer">
          <label>Ta chaîne Mixer : </label>
          <input
            className="linkInput"
            type="link"
            placeholder="Your Mixer channel"
            value={user.mixer}
            onChange={e => {
              dispatch({
                type: "SAVE_PROFILE_DATA",
                value: { mixer: e.target.value }
              });
            }}
          />
        </div>
        <div className="infoContainer">
          <label>Ton pseudo Discord : </label>
          <input
            className="linkInput"
            type="link"
            placeholder="Your Discord pseudo"
            value={user.discord_pseudo}
            onChange={e => {
              dispatch({
                type: "SAVE_PROFILE_DATA",
                value: { discord_pseudo: e.target.value }
              });
            }}
          />
        </div>
      </div>
    </form>
  );
};
export default Links;
