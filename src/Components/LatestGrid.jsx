import { Star } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";
import styles from "../styles/Home.module.css";
import { dispatchStateContext, globalStateContext } from "..";
import { Link } from "react-router-dom";

const LatestGrid = ({ data, selectedGenres, selectedRating, applied }) => {
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
      {data.length >= 1 &&
        data.map((movie, i) => {
          return (
            movie && (
              <div key={i} className={styles.gridItem}>
                <img
                  alt="movieImg"
                  src={
                    `https://image.tmdb.org/t/p/w500/${movie.poster_path}` ||
                    `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`
                  }
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
            )
          );
        })}
    </div>
  );
};

export default LatestGrid;
