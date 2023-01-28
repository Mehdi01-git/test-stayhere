import styles from "./styles/Home.module.css";
import { Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import EdpicksGrid from "./Components/EdpicksGrid";
import SearchGrid from "./Components/SearchGrid";
import { PaginatedItems } from "./Components/Paginate";
import WatchList from "./Components/WatchList";

export default function Home() {
  const [pages, setPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState("All");
  const [selectedRating, setSelectedRating] = useState(9);
  const [selectedLang, setSelectedLang] = useState("en-US");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [applied, setApplied] = useState(false);
  const [displayEdit, setDisplayEdit] = useState(false);
  const [moviePage, setMoviePage] = useState([]);
  const [watchlist, setWatchlist] = useState(false);
  const [picks, setPicks] = useState();
  const [genres, setGenres] = useState();
  const arr = [];
  useEffect(() => {
    const n = 10;
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    [...Array(n)].map(async (item, i) => {
      await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=5ccd6301393b904c4b1b8e5b00f12401&language=${selectedLang}&page=${
          i + (pages === 1 ? 1 : pages === 2 ? 6 : 11)
        }`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          arr.push(result.results);

          setMoviePage(
            arr[0].concat(arr[1], arr[2], arr[3], arr[4], arr[5], arr[6])
          );
        })

        .catch((error) => console.log("error", error));
    });
  }, [pages, applied, selectedLang]);

  useEffect(() => {
    const Search = async () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const serachRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=5ccd6301393b904c4b1b8e5b00f12401&language=${selectedLang}&query=${query}&page=1&include_adult=false`,
        requestOptions
      );
      const searchData = await serachRes.json();
      setSearchResults(
        searchData.results
          .sort((a, b) => {
            return b.vote_average - a.vote_average;
          })
          .filter(
            (movie) =>
              (selectedGenres === "All"
                ? movie.genre_ids &&
                  movie.vote_average <= Number(selectedRating)
                : movie.genre_ids.includes(Number(selectedGenres))) &&
              movie.vote_average <= Number(selectedRating)
          )
      );
    };
    if (query.length > 1) {
      Search();
    }
  }, [query, applied]);

  useEffect(() => {
    async function Get() {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      // Pass data to the page via props
      const topRatedM = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=5ccd6301393b904c4b1b8e5b00f12401&language=en-US&page=1",
        requestOptions
      );
      const genresFetch = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=5ccd6301393b904c4b1b8e5b00f12401&language=en-US",
        requestOptions
      );

      const genres = await genresFetch.json();
      const picks = await topRatedM.json();
      setPicks(picks);
      setGenres(genres);
    }
    Get();
  }, []);

  function handleSearch() {
    setApplied(!applied);
    setDisplayEdit(true);
    setWatchlist(false);
  }

  function handleSelectedGenre(e) {
    setSelectedGenres(e.target.value);
  }
  function handleSelectedLang(e) {
    setSelectedLang(e.target.value);
  }
  function handleQuery(e) {
    setQuery(e.target.value);
  }
  function handleRating(e) {
    setSelectedRating(e.target.value);
  }
  function handledisplayEdit() {
    setDisplayEdit(!displayEdit);
    setQuery("");
    setWatchlist(false);
  }
  function handleWatch() {
    setWatchlist(!watchlist);
    setQuery("");
  }
  return (
    <>
      <main className={styles.main}>
        <div className={styles.left}>
          <div className={styles.searchBox}>
            <p className={styles.searchTit}>Search</p>
            <Search className={styles.SearchIcon} />
            <input
              onChange={(e) => handleQuery(e)}
              placeholder="Search..."
              className={styles.searchBar}
              type="text"
              name=""
              id=""
            />
          </div>
          <div className={styles.FilterBox}>
            <p className={styles.FilterTit}>Search</p>
            <div className={styles.GernesSelect}>
              <label htmlFor="Genres">Genre(s)</label>
              <select
                onChange={(e) => handleSelectedGenre(e)}
                className={styles.genreSelector}
                name="genre"
              >
                <option value="All">All</option>
                {genres &&
                  genres.genres.map((genre, i) => {
                    return (
                      <option key={i} value={genre.id}>
                        {genre.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className={styles.GernesSelect}>
              <label htmlFor="Genres">Rating</label>
              <select
                onChange={(e) => handleRating(e)}
                className={styles.genreSelector}
                name="genre"
              >
                <option value="10">All</option>
                <option value="9">8 Stars</option>
                <option value="7">7 Stars</option>
                <option value="4">4 Stars</option>
              </select>
            </div>
            <div className={styles.GernesSelect}>
              <label htmlFor="Genres">Language</label>
              <select
                onChange={(e) => handleSelectedLang(e)}
                className={styles.genreSelector}
                name="genre"
              >
                <option value="en-US">English</option>
                <option value="fr-FR">French</option>
                <option value="ar-AR">Arabic</option>
              </select>
            </div>
            <button onClick={handleSearch} className={styles.Apply}>
              Apply Filters
            </button>
            <button className={styles.Apply} onClick={handleWatch}>
              {watchlist ? "Hide Watchlist" : "View Watchlist"}
            </button>
            {displayEdit === true ? (
              <button
                className={styles.reSpawnEdit}
                onClick={handledisplayEdit}
              >
                View Editor's picks
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div
          style={{
            display: query != "" ? "none" : "flex",
          }}
          className={styles.right}
        >
          <div
            style={{
              display: watchlist ? "block" : "none",
            }}
            className={styles.Watchlist}
          >
            <h3>Your Watchlist</h3>
            <WatchList />
          </div>
          <div
            style={{
              display:
                displayEdit === false && watchlist === false
                  ? "initial"
                  : "none",
            }}
          >
            <h3 className={styles.Edit}>Editor's picks</h3>
            <EdpicksGrid picks={picks} />
          </div>
          <div
            style={{
              display: watchlist === false ? "initial" : "none",
            }}
          >
            <h3 className={styles.latestMov}>Latest Movies</h3>
            {moviePage.length > 1 ? (
              <PaginatedItems
                selectedGenres={selectedGenres}
                selectedRating={selectedRating}
                applied={applied}
                data={moviePage
                  .filter(
                    (movie) =>
                      movie &&
                      (selectedGenres === "All"
                        ? movie.genre_ids &&
                          movie.vote_average <= Number(selectedRating)
                        : movie.genre_ids.includes(Number(selectedGenres))) &&
                      movie.vote_average <= Number(selectedRating)
                  )
                  .sort((a, b) => b.vote_average - a.vote_average)}
                itemsPerPage={8}
              />
            ) : (
              <p>loading...</p>
            )}
          </div>
          {/* <LatestGrid
            selectedGenres={selectedGenres}
            selectedRating={selectedRating}
            applied={applied}
            data={
              moviePage.length >= 100 &&
              moviePage.filter(
                (movie) =>
                  (selectedGenres === "All"
                    ? movie.genre_ids &&
                      movie.vote_average <= Number(selectedRating)
                    : movie.genre_ids.includes(Number(selectedGenres))) &&
                  movie.vote_average < Number(selectedRating)
              )
            }
          />
          <div className={styles.paginate}>
            <Pagination size="large" onChange={handleChange} count={10} />
          </div> */}
        </div>
        <div
          style={{
            display: query === "" ? "none" : "flex",
            flexDirection: "column",
          }}
        >
          <h3>Search Results for "{query}"</h3>
          <SearchGrid
            data={
              searchResults != undefined
                ? searchResults.sort((a, b) => b.vote_average - a.vote_average)
                : picks && picks.results
            }
          />
        </div>
      </main>
    </>
  );
}
