import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/NewsFeed.scss";
import Postcard from "./Postcard";
import LiveContainer from "./LiveContainer";
import { backend } from "../conf.js";
import { useSelector, useDispatch } from "react-redux";

function Discover() {
  const [posts, setPosts] = useState([]);
  const offsetPosts = useSelector(state => state.offsetPosts);
  const reload = useSelector(state => state.reload);
  const dispatch = useDispatch();
  const [totalPosts, setTotalPosts] = useState(null);

  window.onscroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.scrollHeight
    ) {
      dispatch({ type: "PLUS_TEN" });
    }
  };

  useEffect(() => {
    if (!totalPosts) {
      axios.get(`${backend}/api/totalposts`).then(({ data }) => {
        setTotalPosts(data[0].totalpost);
      });
    }
    if (offsetPosts === 0) {
      axios
        .get(`${backend}/api/posts/discover/${offsetPosts}`)
        .then(({ data }) => {
          setPosts(data);
        });
    } else {
      axios
        .get(`${backend}/api/posts/discover/${offsetPosts}`)
        .then(({ data }) => {
          setPosts(posts.concat(data));
        });
    }
  }, [offsetPosts, reload]);

  return (
    <div className="main-NewsFeed">
      <div className="feed">
        {posts.map(post => (
          <Postcard
            key={post.message}
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
            userTeam={post.team_name}
          />
        ))}
        {offsetPosts >= totalPosts ? (
          <div className="endPageContainer">
            <div className="endPage">Pas de posts à afficher</div>
          </div>
        ) : null}
      </div>
      <LiveContainer />
    </div>
  );
}

export default Discover;
