import React, { useEffect, useState } from "react";
import { dispatchStateContext, globalStateContext } from "..";
import LatestGrid from "./LatestGrid";

const WatchList = () => {
  const [favMovs, setFavMovs] = useState();
  const useGlobalState = () => [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];

  const [state, dispatch] = useGlobalState();

  useEffect(() => {
    const movies = [];
    const fetchMovieId = async (movie) => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      await fetch(
        `https://api.themoviedb.org/3/movie/${movie}?api_key=5ccd6301393b904c4b1b8e5b00f12401&language=en-US`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          movies && movies.push(result);
        })
        .then(() => setFavMovs({ movies: movies }))
        .catch((error) => console.log("error", error));
    };
    state.favsId &&
      state.favsId.map((movie, i) => {
        return fetchMovieId(movie, i);
      });
    state.favsId.length === 0 && setFavMovs({ movies: [] });
  }, [state.favsId.length]);

  return (
    <div>
      <LatestGrid data={favMovs ? favMovs.movies : []} />
    </div>
  );
};

export default WatchList;
