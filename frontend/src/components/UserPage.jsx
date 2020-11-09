import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./style/UserPage.scss";
import { Link } from "react-router-dom";
import { backend } from "../conf.js";
import { Image, CloudinaryContext } from "cloudinary-react";
import axios from "axios";
import { useSelector } from "react-redux";
import Postcard from "./Postcard";

export default function UserPage() {
  const connectedUserId = useSelector(state => state.user_id);
  const [user, getUser] = useState({
    id: null,
    avatar: null,
    pseudo: null,
    age: null,
    country: null,
    city: null,
    role: null,
    bio: null
  });
  const [posts, setPosts] = useState([]);
  const [offsetPosts, setOffsetPosts] = useState(0);
  const paramsUser_id = parseInt(useParams().id);

  window.onscroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.scrollHeight &&
      posts.length >= 10
    ) {
      setOffsetPosts(offsetPosts + 10);
    }
  };

  useEffect(() => {
    setOffsetPosts(0);
    axios
      .get(`${backend}/api/profile/${paramsUser_id}`)
      .then(({ data }) => {
        getUser(data[0]);
      })
      .catch(err => {});
  }, [paramsUser_id]);

  useEffect(() => {
    if (offsetPosts === 0) {
      axios
        .get(`${backend}/api/user/posts/${paramsUser_id}/${offsetPosts}`)
        .then(({ data }) => {
          setPosts(data);
        });
    } else {
      axios
        .get(`${backend}/api/user/posts/${paramsUser_id}/${offsetPosts}`)
        .then(({ data }) => {
          setPosts(posts.concat(data));
        });
    }
  }, [offsetPosts, paramsUser_id]);

  return (
    <div className="userProfile">
      <h1>
        {connectedUserId === paramsUser_id
          ? "Ton profil"
          : "Le profil de " + user.pseudo}
      </h1>
      {connectedUserId === paramsUser_id && (
        <Link to="/editprofile">
          <button className="editButton">Editer</button>
        </Link>
      )}
      {user ? (
        <div className="profile">
          {user.avatar ? (
            <CloudinaryContext cloudName="lanur">
              <Image publicId={user.avatar} className="avatar" />
            </CloudinaryContext>
          ) : (
            <img src="/noob.jpg" alt="avatar" className="avatar" />
          )}
          {user.age || user.role || user.city || user.bio || user.country ? (
            <div className="info">
              {user.age && <p>{user.age + " ans"}</p>}
              <p>{user.role}</p>
              <p>
                {user.city} {user.city && user.country && ","} {user.country}
              </p>
              <p>Ma description : {user.bio}</p>
            </div>
          ) : (
            <p>Aucune information disponible</p>
          )}
        </div>
      ) : null}
      <div className="posts">
        {posts.map(post => (
          <Postcard
            message={post.message}
            tags={post.tags ? "#" + post.tags.replace(/ /g, " #") : null}
            date={post.date}
            image_url={post.image_url}
            game_id={post.game_id}
            user_avatar={post.user_avatar}
            id={post.id}
            user_id={post.user_id}
            nblike={post.nbLike}
            statuslike={post.liked}
            userPseudo={post.pseudo}
            key={post.id}
          />
        ))}
      </div>
    </div>
  );
}
