import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Image, CloudinaryContext } from "cloudinary-react";
import { backend } from "../../conf.js";
import "../style/EditProfileStyles/EditProfile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState("https://via.placeholder.com/250");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("./noob.jpg");
  const user = useSelector(state => state.user);
  const user_avatar = useSelector(state => state.user_avatar);

  useEffect(() => {
    if (user_avatar) {
      setImagePreviewUrl(user_avatar);
    } else {
      setImagePreviewUrl("./noob.jpg");
    }
  }, []);

  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let selectedFile = e.target.files[0];
    reader.onloadend = () => {
      setFile(selectedFile);
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
    handleSubmit(selectedFile);
  };

  const handleSubmit = file => {
    // post of profile picture
    let imageUpload = new FormData();
    imageUpload.append("file", file);
    axios.post(`${backend}/api/postimg`, imageUpload).then(response => {
      let image_url = response.data.public_id;
      dispatch({ type: "CHANGE_AVATAR", value: image_url });
    });
  };

  return (
    <div className="editProfile">
      <h1>Ton profil</h1>

      <div className="infosAvatar">
        <div className="infos">
          <div className="infoContainer">
            <label htmlFor="pseudo">Pseudo : </label>
            <input type="text" name="pseudo" value={user.pseudo} />
          </div>
          <div className="infoContainer">
            <label htmlFor="firstname">Prénom : </label>
            <input
              type="text"
              name="firstname"
              placeholder="Prénom"
              value={user.firstname || ""}
              onChange={e => {
                dispatch({
                  type: "SAVE_PROFILE_DATA",
                  value: { firstname: e.target.value }
                });
              }}
            />
          </div>
          <div className="infoContainer">
            <label htmlFor="lastname">Nom : </label>
            <input
              type="text"
              name="lastname"
              placeholder="Nom"
              value={user.lastname || ""}
              onChange={e => {
                dispatch({
                  type: "SAVE_PROFILE_DATA",
                  value: { lastname: e.target.value }
                });
              }}
            />
          </div>
          <div className="infoContainer">
            <label>Age : </label>
            <input
              type="text"
              placeholder="Age"
              value={user.age || ""}
              onChange={e => {
                dispatch({
                  type: "SAVE_PROFILE_DATA",
                  value: { age: e.target.value }
                });
              }}
            />
          </div>
          <div className="infoContainer">
            <label>Pays : </label>
            <input
              type="text"
              placeholder="Pays"
              value={user.country || ""}
              onChange={e => {
                dispatch({
                  type: "SAVE_PROFILE_DATA",
                  value: { country: e.target.value }
                });
              }}
            />
          </div>
          <div className="infoContainer">
            <label>Ville : </label>
            <input
              type="text"
              placeholder="Ville"
              value={user.city || ""}
              onChange={e => {
                dispatch({
                  type: "SAVE_PROFILE_DATA",
                  value: { city: e.target.value }
                });
              }}
            />
          </div>
          <div className="infoContainer">
            <label htmlFor="genre-select">Genre : </label>
            <select
              name="genre"
              id="genre-select"
              value={user.gender || ""}
              onChange={e => {
                dispatch({
                  type: "SAVE_PROFILE_DATA",
                  value: { gender: e.target.value }
                });
              }}
            >
              <option value="default">-- Séléctionnes ton genre --</option>
              <option value="male">Masculin</option>
              <option value="female">Féminin</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <p>Ton genre ne sera pas visible sur notre site.</p>
        </div>
        <div className="avatar">
          <h1>Avatar</h1>
          {imagePreviewUrl === "./noob.jpg" ? (
            <img src={imagePreviewUrl} alt="" />
          ) : (
            <CloudinaryContext cloudName="lanur">
              <Image publicId={user_avatar} />
            </CloudinaryContext>
          )}
          <input type="file" onChange={e => handleImageChange(e)} />
        </div>
      </div>
    </div>
  );
};
export default Profile;
