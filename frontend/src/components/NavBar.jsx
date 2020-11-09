import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { scaleDown as MenuBurger } from "react-burger-menu";
import "./style/NavBar.scss";
import "./style/Burger.scss";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { backend } from "../conf.js";

function NavBar() {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [displaySearchBar, setDisplaySearchBar] = useState(false);
  const [paramsMenu, setParamsMenu] = useState(false);
  const [burgerMenu, setBurgerMenu] = useState(false);
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user_id);
  const history = useHistory();
  const [search, setSearch] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    axios
      .get(`${backend}/api/search/users/?pseudo=${search}`)
      .then((response) => {
        dispatch({ type: "SEARCH", value: response.data });
      })
      .then(() => {
        history.push("/search");
      })
      .catch(() => {
        history.push("/search");
      });
  };

  const handleStateChange = state => {
    setBurgerMenu(!state.isOpen);
  };

  const change = e => {
    setSearch(e.target.value);
  };
  return (
    <nav className="main-NavBar">
      <h1 onClick={() => setBurgerMenu(false)}>
        <Link to="/newsfeed">
          <span className="Lan">LAN'</span>U.R
        </Link>
      </h1>

      <ul>
        <li
          className="search"
          onClick={() => {
            setParamsMenu(false);
            setDisplayMenu(false);
          }}
        >
          {displaySearchBar && (
            <div className="searchbar">
              <form onSubmit={handleSubmit}>
                <input
                  className="formSearchBar"
                  type="text"
                  placeholder="Cherche un utilisateur avec son pseudo"
                  value={search}
                  onChange={e => change(e)}
                />
              </form>
            </div>
          )}
          <img
            className="toggleSearch"
            src="../images/loupe.svg"
            alt="Search"
            onClick={() => setDisplaySearchBar(!displaySearchBar)}
          />
        </li>
        <li>
          <Link to="/newsfeed">
            <span className="FirstLetter">A</span>ctus
          </Link>
        </li>
        <li>
          <Link to="/teams">
            <span className="FirstLetter">T</span>eams
          </Link>
        </li>
        <li
          className="dropDown"
          onClick={() => {
            setDisplayMenu(!displayMenu);
            setParamsMenu(false);
          }}
        >
          <span className="FirstLetter">É</span>vènements
          {displayMenu ? (
            <img
              className="triangle"
              alt="next"
              src="../images/Black_triangle_rotated.svg"
            ></img>
          ) : (
            <img
              className="triangle"
              alt="previous"
              src="../images/Black_triangle.svg"
            ></img>
          )}
          {displayMenu ? (
            <div className="dropDownMenu">
              <ul>
                <li>
                  <a href="#">
                    <span className="FirstLetter">A</span>genda
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="FirstLetter">R</span>ésultats
                  </a>
                </li>
              </ul>
            </div>
          ) : null}
        </li>
        <li
          onClick={() => {
            setParamsMenu(!paramsMenu);
            setDisplayMenu(false);
          }}
        >
          <button>
            <img
              className="gearIcon"
              alt="Menu"
              src="../images/gear_logo2.png"
            ></img>
          </button>
          {paramsMenu && (
            <div className="dropDownParamsMenu">
              <ul>
                <li>
                  <Link to={`/userpage/${user_id}`}>
                    <span className="FirstLetter">P</span>rofil
                  </Link>
                </li>
                <li onClick={() => dispatch({ type: "DISCONNECT" })}>
                  <span className="FirstLetter">D</span>éconnexion
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
      <div>
        <MenuBurger
          width={"100%"}
          id="MenuBurger"
          isOpen={!burgerMenu}
          onStateChange={state => handleStateChange(state)}
        >
          <ul className="burger">
            <li onClick={() => setBurgerMenu(false)}>
              <Link to="/newsfeed">Actus</Link>
            </li>
            <li onClick={() => setBurgerMenu(false)}>
              <Link to="/teams">Teams</Link>
            </li>
            <li onClick={() => setBurgerMenu(false)}>
              <Link to="/newsfeed">Évènements</Link>
            </li>
            <li onClick={() => setBurgerMenu(false)}>
              <Link to={`/userpage/${user_id}`}>Profil</Link>
            </li>
            <li>
              <form onSubmit={handleSubmit}>
                <input
                  className="searchInput"
                  type="text"
                  placeholder="Cherche un utilisateur avec son pseudo"
                  value={search}
                  onChange={e => change(e)}
                />
                <input
                  className="launchSearch"
                  type="submit"
                  value="rechercher"
                  onClick={() => setBurgerMenu(false)}
                />
              </form>
            </li>
            <li onClick={() => dispatch({ type: "DISCONNECT" })}>
              Déconnexion
            </li>
          </ul>
        </MenuBurger>
      </div>
    </nav>
  );
}

export default NavBar;
