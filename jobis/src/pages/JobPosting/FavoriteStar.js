import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";  // Import useLocation

const FavoriteStar = ({ initialFavorited, onToggle, jobPostingId, uuid }) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const location = useLocation();  // Access the current location (URL)

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited, jobPostingId, uuid]);

  const handleClick = (e) => {
    // Prevent navigation when clicking the star
    e.stopPropagation();

    const newIsFavorited = !isFavorited;
    setIsFavorited(newIsFavorited);
    onToggle(newIsFavorited);  // Notify parent about the toggle state

    // Example: You can use location here if you want to perform a different action based on the URL
    if (location.pathname === "/favorites/search") {
      console.log("In Favorites List, no redirect needed");
      // You can perform other actions if necessary based on the current URL
    }
  };

  return (
    <span onClick={handleClick}>
      {isFavorited ? "⭐" : "✰"}  {/* Change icon based on favorited state */}
    </span>
  );
};

export default FavoriteStar;
