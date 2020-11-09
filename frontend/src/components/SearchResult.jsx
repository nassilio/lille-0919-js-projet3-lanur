import React from "react";
import "./style/SearchResults.scss";
import { useHistory } from "react-router-dom";
import { Image, CloudinaryContext } from "cloudinary-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function SearchResult() {
  const searchResults = useSelector(state => state.searchResults);

  return (
    <div className="main-search">
      <div className="containerComponent">
        <div className="results">
          <h3>Résultats de la recherche</h3>
          {searchResults.length > 0 ? (
            searchResults.map(result => (
              <Link to={`/userpage/${result.id}`} key={result.id}>
                <div className="userContainer">
                  <div className="imgSection">
                    {result.user_avatar ? (
                      <CloudinaryContext cloudName="lanur">
                        <Image
                          publicId={result.user_avatar}
                          className="avatar"
                        />
                      </CloudinaryContext>
                    ) : (
                      <img src="noob.jpg" alt="avatar" className="avatar" />
                    )}
                  </div>
                  <div className="infoSection">
                    <div className="infoResult">Pseudo : {result.pseudo}</div>
                    {result.team_id ? (
                      <div className="infoResult">Team : {result.team_id}</div>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div>Pas de résultats</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
