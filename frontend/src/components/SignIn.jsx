import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Form from "./Form";
import "./style/SignIn.scss";
import { backend } from "../conf";
import { Link } from "react-router-dom";

const SignIn = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [credentialsState, updateCredentialsState] = useState(true);
  const [pseudo, pseudoUpdate] = useState("");
  const [password, passwordUpdate] = useState("");

  const handleSubmit = () => {
    axios.post(`${backend}/api/auth/login`, { pseudo, password }).then(
      response => {
        dispatch({ type: "SAVE_JWT", value: response.data });
        history.push("/NewsFeed");
      },
      error => {
        updateCredentialsState(false);
      }
    );
  };

  const [divCreation, showDivCreation] = useState(false);

  const accountCreation = () => {
    showDivCreation(!divCreation);
  };

  return !divCreation ? (
    <div className="SignIn">
      <div className="catchPhrase">
        <h1>
          <span>LAN'</span>U.R
        </h1>
        <h2>
          Vivons l'<span>Esport</span> ensemble !
        </h2>
      </div>
      <div className="connect">
        <h2>Tu as un compte ?</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          {!credentialsState && (
            <p className="wrong">
              Tes informations semblent fausses, réessaie.
            </p>
          )}
          <h3>Identifiant : </h3>
          <input
            type="text"
            value={pseudo}
            onChange={e => {
              updateCredentialsState(true);
              pseudoUpdate(e.target.value);
            }}
            className={credentialsState ? "" : "wrong"}
          />
          <h3>Mot de passe : </h3>
          <input
            type="password"
            value={password}
            onChange={e => {
              updateCredentialsState(true);
              passwordUpdate(e.target.value);
            }}
            className={credentialsState ? "" : "wrong"}
          />
          <p>mot de passe oublié ?</p>
          <button type="submit" onClick={handleSubmit}>
            Se connecter
          </button>
        </form>
        <h3>Tu n'as pas encore de compte ?</h3>
        <div className="noAccount">
          <button onClick={accountCreation} className="accountCreation">
            Créer un compte
          </button>
          <Link to="/discover">
            <p className="discover">Continuer sans créer de compte</p>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="SignIn">
      <Form />
    </div>
  );
};

export default SignIn;
