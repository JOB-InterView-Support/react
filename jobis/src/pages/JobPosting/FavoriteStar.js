import React, { useState, useEffect } from "react";

const FavoriteStar = ({ initialFavorited, onToggle, jobPostingId }) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited, jobPostingId]);

  const handleClick = (e) => {
    setIsFavorited(!isFavorited);
    onToggle(!isFavorited);  // 새로운 즐겨찾기 상태 전달
  };

  return (
    <span onClick={handleClick}>
      {isFavorited ? "⭐" : "✰"}  {/* 즐겨찾기 아이콘 변경 */}
    </span>
  );
};


export default FavoriteStar;
