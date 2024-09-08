/* src/App.js */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer'; // Ensure this is imported correctly
import MovieGrid from './components/MovieGrid';
import './App.css';
import backButton from './assets/Back.png'; // back button image
import searchIcon from './assets/search.png'; // search icon image
import navBarShadow  from './assets/nav_bar.png'; // shadow effect image

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView(); // Make sure this is set up correctly
  const [allDataFetched,setAllDataFetched] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  // Fetch data as the user scrolls
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await axios.get(` https://test.create.diagnal.com/data/page${page}.json`);
if(res.data.page['page-size-requested'] !== res.data.page['page-size-returned']){
  setAllDataFetched(true)
}
        setMovies((prev) => [...prev, ...res.data.page['content-items'].content]);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    if(!allDataFetched)
    loadMovies();
  }, [page]);

  // Increment page number when user scrolls near the end
  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    setSearchTerm('')
  };
  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter movies based on the search term
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowShadow(true); // Show shadow when scrolled
      } else {
        setShowShadow(false); // Hide shadow when at the top
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="app">
    <header className={`header ${showShadow ? 'shadow' : ''}`}>
      {showSearchBar ? (
        // Show search bar when search icon is clicked
        <div className='search-back'>
        <div className='backSearch'>
           <img
            src={backButton}
            alt="Back"
            className="back-button"
            onClick={toggleSearchBar} // Close search bar on back button click
          />
        </div>
        <div className="search-bar">
          
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            autoFocus // Automatically focuses on the search input
          />
         </div>
        </div>
      ) : (
        // Show default header with back button, title, and search icon
        <>
        <div className='notSearch'>
          <img src={backButton} alt="Back" className="back-button" />
          <div className="header-title">Romantic Comedy</div>
          <img
            src={searchIcon}
            alt="Search"
            className="search-icon"
            onClick={toggleSearchBar} // Open search bar on search icon click
          />
          </div>
        </>
      )}
      {showShadow && <img src={navBarShadow} alt="Navbar Shadow" className="navbar-shadow" />}
    </header>

    <MovieGrid items={filteredMovies} />

    <div ref={ref} className="loading">
      {/* Infinite scrolling trigger */}
    </div>
  </div>
);
};

export default App;
