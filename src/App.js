import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("react hooks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef();
  // useEffect will run after every render, causing infinite requests
  // .then/.catch
  // useEffect(() => {
  //   axios
  //     .get("https://hn.algolia.com/api/v1/search?query=reacthooks")
  //     .then(response => {
  //       // console.log(response.data);
  //       setResults(response.data.hits);
  //     })
  //     .catch(err => console.log(err));
  //   // by adding the empty array, it assures that useEffect will only run on componentDidMount and not on any updates
  // }, []);

  // ASYNC/AWAIT
  useEffect(() => {
    // async implicitly creates a promise
    // could do this, but to keep useEffect clean right the fn expression below
    // async function getResults() {
    //   const response = await axios.get(
    //     "https://hn.algolia.com/api/v1/search?query=reacthooks"
    //   );
    //   setResults(response.data.hits);
    // }
    getResults();
    // if we want to run useEffect>getResults right after query is updated
    // this is referred to as a query dependency
    // }, [query]);
  }, []);

  const getResults = async () => {
    setLoading(true);

    if (query) {
      try {
        const response = await axios.get(
          `https://hn.algolia.com/api/v1/search?query=${query}`
        );
        setResults(response.data.hits);
      } catch (e) {
        setError(e);
      }
    }
    setLoading(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    getResults();
  };

  const handleClearSearch = () => {
    setQuery("");
    // return focus to the input after clearing the input
    // could also get the value by using .value instead
    searchInputRef.current.focus();
  };

  return (
    <div className="max-w-lg mx-auto p-4 m-2 bg-purple-300 shadow-lg rounded">
      <img
        src="https://icon.now.sh/react/c0c"
        alt="React Logo"
        className="float-right h-12"
      />
      <h1 className="text-grey-900 font-thin text-2xl">Hooks News</h1>
      <form onSubmit={handleSubmit} className="mb-2">
        <input
          id="search-input"
          type="text"
          value={query}
          ref={searchInputRef}
          onChange={event => setQuery(event.target.value)}
          className="border p-1 rounded"
        />
        <button
          type="submit"
          className="bg-purple-900 text-white rounded m-1 px-3 py-1"
        >
          Search
        </button>
        <button
          type="button"
          className="bg-white text-purple-900 border-solid rounded m-1 px-3 py-1"
          onClick={handleClearSearch}
        >
          Clear
        </button>
      </form>
      {loading ? (
        <div className="font-bold text-blue">Loading results...</div>
      ) : (
        <ul className="leading-loose">
          {results.map(result => {
            if (result.url) {
              return (
                <li key={result.objectID}>
                  <a
                    href={result.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="underline hover:text-white"
                  >
                    {result.title}
                  </a>
                </li>
              );
            }
            return null;
          })}
        </ul>
      )}
      {error && <div className="font-bold text-red-500">{error.message}</div>}
    </div>
  );
}
