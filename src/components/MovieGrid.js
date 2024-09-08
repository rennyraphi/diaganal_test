/* src/components/MovieGrid.js */
import React from 'react';
import './MovieGrid.css';
import placeholderImage from '../assets/placeholder_for_missing_posters.png'; // Placeholder for missing images

const MovieGrid = ({ items }) => {
  return (
    <div className="movie-grid">
      {items.map((item, index) => (
        <div key={index} className="poster">
          <img
            src={`https://test.create.diagnal.com/images/${item['poster-image']}`}
            alt={item.name}
            onError={(e) => (e.target.src = placeholderImage)} // Use placeholder for missing images
          />
          <p>{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
