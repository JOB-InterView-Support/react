import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const FavoriteStar = ({ initialFavorited, onToggle, jobPostingId }) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const handleClick = (e) => {
    e.stopPropagation();  // 이벤트 전파 방지
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    onToggle(newFavoriteState);  // 새로운 즐겨찾기 상태 전달
  };

  return (
    <span onClick={handleClick}>
      {isFavorited ? "⭐" : "✰"}  {/* 즐겨찾기 아이콘 변경 */}
    </span>
  );
};

FavoriteStar.propTypes = {
  initialFavorited: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  jobPostingId: PropTypes.string.isRequired
};

export default FavoriteStar;
