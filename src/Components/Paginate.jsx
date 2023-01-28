import { Star } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "../styles/Home.module.css";
import { dispatchStateContext, globalStateContext } from "..";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

// Example items, to simulate fetching from another resources.
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

function Items({ currentItems, selectedRating, selectedGenres }) {
  const useGlobalState = () => [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];
  const [state, dispatch] = useGlobalState();
  function putItem() {
    localStorage.setItem("FavMovies", JSON.stringify(state.favsId));
  }
  const handleRemove = (id) => {
    const newPeople = state.favsId.filter((person) => person !== id);

    dispatch({
      favsId: newPeople,
    });
  };
  useEffect(() => {}, []);
  return (
    <div className={styles.editGrid}>
      {currentItems &&
        currentItems.map((movie, i) => (
          <div key={i} className={styles.gridItem}>
            <img
              width="100%"
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
              <Link state={{ id: movie.id }} to={`/${movie.id}`}>
                View Info
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

export function PaginatedItems({
  itemsPerPage,
  data,
  selectedRating,
  selectedGenres,
  applied,
}) {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    const newdata = data.filter(
      (movie) =>
        (selectedGenres === "All"
          ? movie.genre_ids && movie.vote_average <= Number(selectedRating)
          : movie.genre_ids.includes(Number(selectedGenres))) &&
        movie.vote_average < Number(selectedRating)
    );
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, applied]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };
  return (
    <div>
      <Items
        selectedGenres={selectedGenres}
        selectedRating={selectedRating}
        currentItems={currentItems}
      />
      <div className={styles.paginator}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}
