import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTagInput from "@pathofdev/react-tag-input";
import { toast } from "react-toastify";
import "@pathofdev/react-tag-input/build/index.css";
import "./style/Tag.scss";

function Tag() {
  const tags = useSelector(state => state.tags);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "TAG", value: tags });
  }, [tags]);
  const notify = () => toast("Ne pas utiliser d'espace dans les tags.");
  return (
    <div className="tag">
      <ReactTagInput
        placeholder="Tape et appuie sur entrée pour ajouter un tag"
        tags={tags}
        maxTags={8}
        validator={value => {
          if (!value.includes(" ")) {
            return value;
          }
          return notify() && null;
        }}
        onChange={newTags => dispatch({ type: "TAG", value: newTags })}
      />
    </div>
  );
}

export default Tag;
