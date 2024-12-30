import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../../AuthProvider";

// 별 아이콘 컴포넌트
const FavoriteStar = ({ initialFavorited, onToggle }) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited); // 즐겨찾기 상태 관리
  const { secureApiRequest, uuid } = useContext(AuthContext); // uuid 가져오기

  // fetchFavorites 함수 예시: 즐겨찾기 상태를 가져오는 API 호출
  const fetchFavorites = async () => {
    if (!uuid) return; // uuid가 없으면 호출하지 않음
    try {
      const response = await secureApiRequest(`/favorites/search?uuid=${uuid}`);
      // 여기서 응답에 따라 isFavorited 상태를 업데이트 할 수 있음.
      const favorites = await response.json();
      // 예시: 원하는 방식으로 상태 업데이트 (이를 실제로 사용하는 로직에 맞게 수정)
      setIsFavorited(favorites.includes(initialFavorited)); 
    } catch (error) {
      console.error('즐겨찾기 불러오기 오류:', error);
    }
  };

  // uuid나 secureApiRequest가 변경되면 fetchFavorites를 호출
  useEffect(() => {
    fetchFavorites();
  }, [uuid, secureApiRequest]);

  // 별 클릭 시 상태 토글
  const handleStarClick = () => {
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);
    onToggle(newFavoritedState); // 부모에게 상태 변경 전달
  };

  return (
    <div onClick={handleStarClick} style={{ cursor: 'pointer' }}>
      {isFavorited ? (
        <span role="img" aria-label="star">⭐</span> // 즐겨찾기 상태가 true일 때 별
      ) : (
        <span role="img" aria-label="star">☆</span> // 즐겨찾기 상태가 false일 때 빈 별
      )}
    </div>
  );
};

export default FavoriteStar;
