import {
  ArrowBackIosNew,
  ArrowBackOutlined,
  Star,
  StarBorder,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/MoviePage.module.css";
import { dispatchStateContext, globalStateContext } from "..";
import React, { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";

const Ids = () => {
  const location = useLocation();
  const [movie, setMovie] = useState();
  const [movieCred, setMovieCred] = useState();
  const [movieRating, setMovieRating] = useState();
  useEffect(() => {
    async function Fetch() {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      // Pass data to the page via props
      const fetchMovie = await fetch(
        `https://api.themoviedb.org/3/movie${location.pathname}?api_key=5ccd6301393b904c4b1b8e5b00f12401&language=en-US`,
        requestOptions
      );
      const fetchMovieCred = await fetch(
        `https://api.themoviedb.org/3/movie${location.pathname}/credits?api_key=5ccd6301393b904c4b1b8e5b00f12401&language=en-US`,
        requestOptions
      );
      const fetchMovieRat = await fetch(
        `https://api.themoviedb.org/3/movie${location.pathname}/reviews?api_key=5ccd6301393b904c4b1b8e5b00f12401&language=en-US`,
        requestOptions
      );
      const movie = await fetchMovie.json();
      const movieCred = await fetchMovieCred.json();
      const movieRating = await fetchMovieRat.json();

      setMovie(movie);
      setMovieCred(movieCred);
      setMovieRating(movieRating);
    }
    Fetch();
  }, [location.pathname]);

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
    <>
      {movie && (
        <main className={styles.moviePageMain}>
          <div className={styles.left}>
            <Link to="/">
              <ArrowBackOutlined style={{ fontSize: "30px" }} />
            </Link>
          </div>
          <div className={styles.layout}>
            <div className={styles.center}>
              <h2>{movie.title}</h2>
              <div className={styles.rating}>
                <Star />
                <p>{movie.vote_average}</p>
              </div>
              <p>{movie.overview}</p>
              <div className={styles.creators}>
                <b>Companies :</b>
                <div className={styles.prodComp}>
                  {movie.production_companies.map((comp, i) => {
                    return <p key={i}>{comp.name}</p>;
                  })}
                </div>
              </div>
              <div className={styles.creators}>
                <b>Actors :</b>
                <div className={styles.prodComp}>
                  {movieCred.cast.slice(0, 3).map((comp, i) => {
                    return <p key={i}>{comp.name}</p>;
                  })}
                </div>
              </div>
              {window.localStorage.getItem("FavMovies") &&
              window.localStorage.getItem("FavMovies").includes(movie.id) ? (
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
              <div>
                <b>Top Casts</b>
                <div className={styles.casts}>
                  {movieCred.cast.slice(0, 6).map((cast, i) => {
                    return (
                      <img
                        key={i}
                        src={`https://image.tmdb.org/t/p/w500/${cast.profile_path}`}
                        alt=""
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={styles.center}>
              <img
                className={styles.rightImg}
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt=""
              />
            </div>
            <div className={styles.center1}>
              <h3>Rating :</h3>
              {movieRating.results.slice(0, 5).map((rating, i) => {
                return (
                  <div key={i}>
                    <b>{rating.author}</b>
                    <p>{rating.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}
    </>
  );
};
// export async function getStaticProps ({id}) {

// }
export default Ids;
