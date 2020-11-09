import React, { useEffect, useState } from "react";
import axios from "axios";
import { Image, CloudinaryContext } from "cloudinary-react";
import { backend } from "../conf.js";
import "./style/Teams.scss";

function Team() {
  const [teams, getTeams] = useState([]);
  useEffect(() => {
    axios
      .get(`${backend}/api/teams/`)
      .then(({ data }) => {
        getTeams(data);
      })
      .catch(err => {});
  }, []);
  return (
    <div className="teamPage">
      <h1>Teams</h1>
      {teams
        ? teams.map(team => {
            return (
              <div className="teams" key={team.name}>
                <div className="img">
                  <img src={team.image_team} alt="No image" />
                </div>
                <div className="teamInfo">
                  <h2>{team.name}</h2>
                  <p>{team.description}</p>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
}

export default Team;
