import React, { useState } from "react";
import "./style/GameChoice.scss";

function GameChoice(props) {
  const [click, setClick] = useState(false);
  return (
    <div className="gameChoice" onClick={() => setClick(!click)}>
      <button className={click ? "status-on" : "status-off"}>
        <img className="picture" alt="image_jeu" src={props.picture} />
        {click && (
          <img
            className="checkbox"
            alt="jeu séléctionné"
            src="/pictures/checkboxpurple.png"
          />
        )}
      </button>
    </div>
  );
}

export default GameChoice;
