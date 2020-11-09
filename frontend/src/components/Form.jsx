import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import GameChoice from "./GameChoice";
import GameList from "../GameList";
import "./style/IdForm.scss";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { backend } from "../conf.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/Tag.scss";

function Form() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [registration, setRegistration] = useState({
    pseudo: "",
    email: "",
    password: ""
  });

  const [page, setPage] = useState(1);
  const [error, setError] = useState();

  const notify = error => toast(error);

  const handleSubmit = () => {
    const newUser = registration;
    axios
      .post(`${backend}/api/auth/signup`, newUser)
      .then(response => {
        dispatch({ type: "SAVE_JWT", value: response.data });
        history.push("/newsfeed");
      })
      .catch(err => {
        if (err.response) {
          let response = err.response.data;
          if (response.includes("email_UNIQUE")) {
            setPage(1);
            setError("email");
            notify("Email déjà utilisé");
          } else if (response.includes("pseudo_UNIQUE")) {
            setPage(1);
            setError("pseudo");
            notify("Pseudo déjà utilisé");
          }
        } else {
          setPage(1);
          setError("inconnu");
          notify("Erreur inconnue, merci de réessayer");
        }
      });
  };

  return (
    <ReactCSSTransitionGroup
      transitionName="formulaire"
      transitionEnterTimeout={0}
      transitionLeaveTimeout={0}
      transitionAppear={true}
      transitionAppearTimeout={700}
      transitionEnter={true}
      transitionLeave={true}
    >
      <div className="formContainer">
        <form
          className="form"
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <div className="buttonContainer">
            {page !== 1 && (
              <button className="previous" onClick={() => setPage(page - 1)}>
                Précédent
              </button>
            )}
            {page === 2 && (
              <button className="validate" onClick={handleSubmit}>
                Valider !
              </button>
            )}
          </div>
          {page === 1 ? (
            <div className="page1">
              <div className="introText">
                Nous avons besoin de quelques infos pour démarrer :
              </div>
              <div>
                {/* Pseudo -------------------------------------------------------------------------------------------- */}

                <div className="inputContainer">
                  <label className="label">Pseudo : </label>
                  <input
                    className={error === "pseudo" ? "error" : "idInput"}
                    type="text"
                    value={registration.pseudo}
                    onChange={event => {
                      setRegistration({
                        ...registration,
                        pseudo: event.target.value
                      });
                    }}
                  />
                </div>

                {/* email -------------------------------------------------------------------------------------------- */}

                <div className="inputContainer">
                  <label className="label">E-mail : </label>
                  <input
                    className={error === "email" ? "error" : "idInput"}
                    type="email"
                    value={registration.email}
                    onChange={event => {
                      setRegistration({
                        ...registration,
                        email: event.target.value
                      });
                    }}
                  />
                </div>
                {/* Password -------------------------------------------------------------------------------------------- */}

                <div className="inputContainer">
                  <label className="label">Mot de passe : </label>
                  <input
                    className="idInput"
                    type="password"
                    value={registration.password}
                    onChange={event => {
                      setRegistration({
                        ...registration,
                        password: event.target.value
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {page === 2 ? (
            <div className="page2">
              <div className="introText">
                Choisis tes jeux favoris (pense à scroller) :
              </div>
              <div className="bigGamePage">
                <div className="gamePage">
                  {GameList.map(game => {
                    return (
                      <GameChoice
                        name={game.name}
                        picture={game.picture}
                        key={game.name}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {page !== 2 ? (
            <button className="button" onClick={() => setPage(page + 1)}>
              Suivant
            </button>
          ) : (
            ""
          )}
        </form>
      </div>
    </ReactCSSTransitionGroup>
  );
}

export default Form;
