import React, { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import axios from "axios";
import { backend } from "../conf.js";
import useModal from "./useModal.js";
import "./style/LiveCard.scss";

function LiveCard(props) {
  const { isShowing, toggle } = useModal();
  const streamTitle = props.stream_title;
  const [gameId, setGameId] = useState([]);

  useEffect(() => {
    axios.get(`${backend}/api/gamelist/${props.game_id}`).then(({ data }) => {
      setGameId(data);
    });
  }, []);

  return (
    <div className="streamingStatus" onClick={toggle} title={streamTitle}>
      <Modal isShowing={isShowing} hide={toggle} user_name={props.user_name} />
      {gameId.length > 0 ? (
        <img
          className="blank_game_logo"
          alt="Logo Jeu"
          src={`/games_icons/${gameId[0].id}.jpg`}
        />
      ) : (
        <div className="blank_game_logo"></div>
      )}
      <img
        src="https://www.freepnglogos.com/uploads/twitch-logo-vector-png-2.png"
        alt="Image Stream"
      />
      <div className="streamInfo">
        <span className="streamerName">{props.streamer_name}</span>
        <div className="viewersCount">Viewers : {props.viewer_count}</div>
      </div>
    </div>
  );
}

export default LiveCard;
