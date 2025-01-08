import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./FavoritesList.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

const FavoritesList = () => {
  const { secureApiRequest, uuid } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await secureApiRequest(`/favorites/search?uuid=${uuid}`, { method: "GET" });
        setFavorites(response?.data || []);
      } catch (error) {
        console.error("즐겨찾기 목록 불러오기 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [secureApiRequest, uuid]);

  const removeFavorite = async (jobPostingId) => {
    try {
      await secureApiRequest(`/favorites/delete`, {
        method: "DELETE",
        body: JSON.stringify({ jobPostingId, uuid }),
      });
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.jobPostingId !== jobPostingId));
    } catch (error) {
      console.error("즐겨찾기 삭제 중 오류:", error);
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <JobPostingSubMenubar />
        <div className={styles.container}>
          <h2>즐겨찾기 목록</h2>
          <div className={styles.favoriteList}>
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <div key={favorite.jobPostingId} className={styles.favoriteCard}>
                  <h3>{favorite.title || "제목 없음"}</h3>
                  <p>회사명: {favorite.companyName || "정보 없음"}</p>
                  <button onClick={() => navigate(`/jobPosting/${favorite.jobPostingId}`)}>상세보기</button>
                  <button onClick={() => removeFavorite(favorite.jobPostingId)}>즐겨찾기 삭제</button>
                </div>
              ))
            ) : (
              <p>즐겨찾기한 채용공고가 없습니다.</p>
            )}
          </div>
      </div>
    </div> 
  );
};

export default FavoritesList;
