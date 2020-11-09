import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "../style/EditProfileStyles/EditRole.scss";

const Role = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  return (
    <form className="role">
      <h1>Ton rôle</h1>
      <div>
        <div className="infoContainer">
          <label htmlFor="role-select">Ton rôle : </label>
          <select
            name="role"
            id="role-select"
            value={user.role}
            onChange={e => {
              dispatch({
                type: "SAVE_PROFILE_DATA",
                value: { role: e.target.value }
              });
            }}
          >
            <option value="">-- Séléctionne ton rôle --</option>
            <option value="Player">Joueur</option>
            <option value="Pro-player">Joueur Professionnel</option>
            <option value="Coach">Coach</option>
            <option value="Team manager">Manager de Team</option>
          </select>
        </div>
        <div className="infoContainer">
          <label>Ta description : </label>
          <textarea
            type="text"
            placeholder="Décris ton parcours esport professionnel ou non ! :)"
            value={user.bio}
            onChange={e => {
              dispatch({
                type: "SAVE_PROFILE_DATA",
                value: { bio: e.target.value }
              });
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default Role;
