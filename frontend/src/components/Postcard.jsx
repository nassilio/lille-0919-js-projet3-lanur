import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./style/postcard.scss";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import "moment/locale/fr";
import { Image, CloudinaryContext } from "cloudinary-react";
import axios from "axios";
import { backend } from "../conf.js";
import { toast } from "react-toastify";

function Postcard(props) {
  const history = useHistory();
  const [like, setLike] = useState(false);
  const [nbLike, nbLikeUpdate] = useState(0);
  const [comment, setComment] = useState("");
  const [displayComments, setDisplayComments] = useState(false);
  const [comments, setComments] = useState([]);
  const user_id = useSelector((state) => state.user_id);
  const notifyComment = () => toast("Commentaire envoyé!");
  const wrongComment = () =>
    toast("Oups, impossible d'envoyer un commentaire vide");
  const commentClick = (id) => {
    setDisplayComments(!displayComments);
    getComments();
  };
  useEffect(() => {
    setLike(props.statuslike ? true : false);
    nbLikeUpdate(props.nblike);
  }, [props.statuslike]);

  const handleLike = (like) => {
    axios.put(`${backend}/api/posts/${props.id}/like`, {
      userLike: like ? 1 : 0
    });
  };
  const getComments = () => {
    axios.get(`${backend}/api/comments/post/${props.id}`).then(({ data }) => {
      setComments(data);
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    let commentContent = {
      content: comment,
      post_id: props.id,
      user_id: user_id
    };
    if (comment) {
      axios.post(`${backend}/api/comments`, commentContent).then((response) => {
        setComment("");
        notifyComment();
        getComments();
      });
    } else {
      wrongComment();
    }
  };

  return (
    <div className="postContainer">
      <div className="post">
        {/* section with avatar and game logo */}
        <div className=" imgSection">
          <div
            onClick={() => {
              history.push("/userpage/" + props.user_id);
            }}
          >
            {props.user_avatar ? (
              <CloudinaryContext cloudName="lanur">
                <Image publicId={props.user_avatar} className="avatar" />
              </CloudinaryContext>
            ) : (
              <img src="/noob.jpg" alt="avatar" className="avatar" />
            )}
          </div>
          {props.game_id > 0 ? (
            <div>
              <img
                src={`/games_icons/${props.game_id}.jpg`}
                className="avatar"
                alt="Jeu"
              />
            </div>
          ) : null}

          {props.id ? (
            <div
              className="nbLike"
              onClick={() => {
                if (like) nbLikeUpdate(nbLike - 1);
                else nbLikeUpdate(nbLike + 1);
                handleLike(!like);
                setLike(!like);
              }}
            >
              +{nbLike}
            </div>
          ) : null}
        </div>
        <div className="contentPostContainer">
          <div className="contentPost">
            {/* section with name and information about the post */}
            <div className="headpost">
              <div>{props.userPseudo}</div>
              <div>{props.userTeam}</div>
              <div>
                <Moment locale="fr" format="LL" date={props.date} />
              </div>
            </div>

            {/* section with the content of the post*/}
            <div className="contentpost">
              {/* section with the postcomment*/}
              <div className="postComment ">{props.message}</div>
              {props.image_url ? (
                <div className="mediaContainer">
                  {/* section with the media*/}
                  <CloudinaryContext cloudName="lanur">
                    <Image publicId={props.image_url} className="postmedia" />
                  </CloudinaryContext>
                </div>
              ) : null}
              {props.image_preview_url ? (
                <div className="mediaContainer">
                  <img
                    className="postmedia"
                    alt="preview_image"
                    src={props.image_preview_url}
                  />
                </div>
              ) : null}
            </div>
            <div className="tag">{props.tags}</div>
            {props.id && user_id ? (
              <div className="reaction">
                <div
                  className={
                    like ? "reaction-button-clicked" : "reaction-button"
                  }
                >
                  <button
                    onClick={() => {
                      if (like) nbLikeUpdate(nbLike - 1);
                      else nbLikeUpdate(nbLike + 1);
                      handleLike(!like);
                      setLike(!like);
                    }}
                  >
                    +1
                  </button>
                </div>
                <div className="reaction-button">
                  <button onClick={() => commentClick()}>Commentaires</button>
                </div>
              </div>
            ) : null}
            {displayComments && props.id ? (
              <div className="commentContainer">
                Commentaires
                <textarea
                  type="text"
                  name="message"
                  placeholder="Exprimez-vous !"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  className="commenttext"
                  maxLength="500"
                  value={comment}
                ></textarea>
                <button onClick={(e) => onSubmit(e)}>Envoyer</button>
                <div className="comments">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div className="comment">
                        <div>
                          {comment.avatar ? (
                            <CloudinaryContext cloudName="lanur">
                              <Image
                                publicId={comment.avatar}
                                className="avatar"
                              />
                            </CloudinaryContext>
                          ) : (
                            <img
                              src="noob.jpg"
                              alt="avatar"
                              className="avatar"
                            />
                          )}
                        </div>
                        <p>
                          <span className="pseudo">{comment.pseudo}</span> -{" "}
                          {comment.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>Pas encore de commentaire. Soit le premier!</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Postcard;
