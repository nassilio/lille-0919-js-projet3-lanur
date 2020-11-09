import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../conf.js";
import { useSelector, useDispatch } from "react-redux";
import "./style/Filter.scss";

function Filter() {
  const dispatch = useDispatch();
  const [gamelist, setGamelist] = useState([]);
  const filters = useSelector(state => state.filters);
  const [filterDisplay, setFilterDisplay] = useState(false);

  useEffect(() => {
    axios.get(`${backend}/api/gamelist/`).then(({ data }) => {
      setGamelist(data);
    });
  }, []);

  const displayFilter = () => {
    setFilterDisplay(!filterDisplay);
  };

  const insertValue = e => {
    if (e.target.checked) {
      filters.push(parseInt(e.target.id));
    } else {
      for (let i = 0; i < filters.length; i++) {
        if (filters[i] === parseInt(e.target.id)) {
          filters.splice(i, 1);
        }
      }
    }
    dispatch({ type: "FILTER", value: filters });
    dispatch({ type: "RESET" });
  };

  return (
    <div className="filtercontainer">
      <div className="filterButton" onClick={() => displayFilter()}>
        <p>Filtrer les posts</p>
        <div className="filterPlus">{filterDisplay ? "-" : "+"}</div>
      </div>
      {filterDisplay ? (
        <form className="filter">
          {gamelist.map(game => (
            <div key={game.id}>
              {filters.includes(game.id) ? (
                <input
                  id={game.id}
                  type="checkbox"
                  onChange={e => {
                    insertValue(e);
                  }}
                  checked
                />
              ) : (
                <input
                  id={game.id}
                  type="checkbox"
                  onChange={e => {
                    insertValue(e);
                  }}
                />
              )}
              <label htmlFor={game.id}>{game.name}</label>
            </div>
          ))}
        </form>
      ) : null}
    </div>
  );
}

export default Filter;
