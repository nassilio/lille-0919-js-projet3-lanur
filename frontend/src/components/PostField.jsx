import React, { useState, useEffect } from "react";
import "./style/PostField.scss";
import axios from "axios";
import { backend } from "../conf.js";
import Postcard from "./Postcard";
import { Image, CloudinaryContext } from "cloudinary-react";
import { useDispatch, useSelector } from "react-redux";
import Tag from "./Tag";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/Tag.scss";

function PostField() {
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user_id);
  const user_avatar = useSelector(state => state.user_avatar);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [gamelist, setGamelist] = useState([]);
  const [game_id, setGame_id] = useState("noGame");
  const tags = useSelector(state => state.tags);

  const notify = () => toast("Post envoyé!");

  useEffect(() => {
    axios.get(`${backend}/api/gamelist/`).then(({ data }) => {
      setGamelist(data);
    });
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
  };

  const onSubmit = e => {
    e.preventDefault();
    if (file) {
      let imageUpload = new FormData();
      imageUpload.append("file", file);
      axios.post(`${backend}/api/postimg`, imageUpload).then(response => {
        let image_url = response.data.public_id;
        let postObject;
        if (game_id !== "noGame") {
          postObject = { image_url, message, user_id, game_id, tags };
        } else {
          postObject = { image_url, message, user_id, tags, game_id: null };
        }
        axios.post(`${backend}/api/posts`, postObject).then(() => {
          setMessage("");
          setFile(null);
          setImagePreviewUrl(null);
          setGame_id("noGame");
          notify();
          dispatch({ type: "RESET" });
        });
      });
    } else if (message) {
      let postObject;
      if (game_id !== "noGame") {
        postObject = { message, user_id, game_id, tags };
      } else {
        postObject = { message, user_id, tags, game_id: null };
      }
      axios.post(`${backend}/api/posts`, postObject).then(() => {
        setMessage("");
        setFile(null);
        setImagePreviewUrl(null);
        setGame_id("noGame");
        notify();
        dispatch({ type: "RESET" });
      });
    }
  };

  return (
    <div className="postFieldContainer">
      <div className="postField">
        <div className="avatar">
          {user_avatar ? (
            <CloudinaryContext cloudName="lanur">
              <Image publicId={user_avatar} className="avatarImg" />
            </CloudinaryContext>
          ) : (
            <img src="/noob.jpg" alt="avatar" className="avatarImg" />
          )}
        </div>
        <form onSubmit={e => onSubmit(e)}>
          <p>Quoi de neuf aujourd'hui ?</p>
          <textarea
            type="text"
            name="message"
            placeholder="Exprimez-vous !"
            value={message}
            onChange={e => {
              setMessage(e.target.value);
            }}
            className="headPost"
            maxLength="500"
          />
          <input type="file" onChange={e => handleImageChange(e)} />
          <Tag />
          <div className="gameSelection">
            Jeu concerné:
            <select
              name="game"
              onChange={e => {
                setGame_id(e.target.value);
              }}
            >
              <option value="noGame" key={"noGame"}>
                Choisis ton jeu
              </option>
              
              {gamelist.map(game => (
                <option value={game.id} key={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Poster</button>
        </form>
      </div>
      {message || imagePreviewUrl || game_id !== "noGame" || tags.length ? (
        <div className="preview-container">
          <div className="preview">Aperçu de ton post:</div>
          <Postcard
            image_preview_url={imagePreviewUrl}
            message={message}
            tags={"#" + tags.join(" #")}
            game_id={game_id}
          />
        </div>
      ) : null}
    </div>
  );
}

export default PostField;
