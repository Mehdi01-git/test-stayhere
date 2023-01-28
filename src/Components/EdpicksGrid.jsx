import { Star } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { dispatchStateContext, globalStateContext } from "..";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

const EdpicksGrid = ({ picks }) => {
  const useGlobalState = () => [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];

  const [state, dispatch] = useGlobalState();
  function putItem() {
    localStorage.setItem("FavMovies", JSON.stringify(state.favsId));
  }
  function handleRemove(id) {
    const newPeople = state.favsId.filter((person) => person !== id);

    dispatch({
      favsId: newPeople,
    });
  }
  return (
    <div className={styles.editGrid}>
      {picks &&
        picks.results
          .sort((a, b) => {
            return b.vote_average - a.vote_average;
          })
          .slice(10, 14)
          .map((movie, i) => {
            return (
              <div key={i} className={styles.gridItem}>
                <img
                  alt="movieImg"
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                />
                <div className={styles.Info}>
                  <p>{movie.title}</p>
                  <div className={styles.rating}>
                    <Star />
                    <p>{movie.vote_average}</p>
                  </div>
                  {window.localStorage.getItem("FavMovies") &&
                  window.localStorage
                    .getItem("FavMovies")
                    .includes(movie.id) ? (
                    <Tooltip title="Double Click to Remove">
                      <button
                        onClick={() => {
                          handleRemove(movie.id);
                          putItem();
                        }}
                      >
                        Remove from Watchlist
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Click to Add">
                      <button
                        onClick={() => {
                          dispatch(state.favsId.push(movie.id));
                          putItem();
                        }}
                      >
                        Add to Watchlist
                      </button>
                    </Tooltip>
                  )}

                  <Link state={{ id: movie.id }} to={`/${movie.id}`}>
                    View Info
                  </Link>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default EdpicksGrid;
