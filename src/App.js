import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("react hooks");
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
    if (query) {
      const response = await axios.get(
        `https://hn.algolia.com/api/v1/search?query=${query}`
      );
      setResults(response.data.hits);
    }
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
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="search-input"
          type="text"
          value={query}
          ref={searchInputRef}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleClearSearch}>
          Clear
        </button>
      </form>
      <ul>
        {results.map(result => {
          if (result.url) {
            return (
              <li key={result.objectID}>
                <a href={result.url} target="_blank">
                  {result.title}
                </a>
              </li>
            );
          }
        })}
      </ul>
    </>
  );
}
