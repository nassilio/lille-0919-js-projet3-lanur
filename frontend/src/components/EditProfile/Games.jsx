import React, { useState } from "react";
import "../style/EditProfileStyles/EditGames.scss";
import GameList from "../../GameList";

const Games = () => {
  const [selectedGames, setSelectedGames] = useState([]);

  return (
    <div className="games">
      <h1>Tes jeux favoris</h1>
      <ul>
        {GameList.map((game, i) => {
          return (
            <li
              key={i}
              className={selectedGames.includes(game.name) ? "selected" : ""}
              onClick={() => {
                if (!selectedGames.includes(game.name)) {
                  setSelectedGames([...selectedGames, game.name]);
                } else {
                  setSelectedGames(
                    [...selectedGames].filter(e => e !== game.name)
                  );
                }
              }}
            >
              <img src={game.picture} alt={game.name} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Games;
