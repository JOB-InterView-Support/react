import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./FavoritesList.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]); // 즐겨찾기 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();
  const { secureApiRequest, uuid } = useContext(AuthContext); // uuid 가져오기

  // 즐겨찾기 목록 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await secureApiRequest(`/favorites/${uuid}`, { method: "GET" });
        setFavorites(response?.data?.jobs?.job || []); // 즐겨찾기 목록 설정
      } catch (err) {
        setError("즐겨찾기 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [uuid, secureApiRequest]);

  // 즐겨찾기 삭제
  const removeFavorite = async (jobPostingId) => {
    try {
      await secureApiRequest(`/favorites/${jobPostingId}`, { method: "DELETE" });
      setFavorites(favorites.filter((fav) => fav.job_posting_id !== jobPostingId)); // 목록에서 해당 항목 삭제
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  // 채용공고 상세보기로 이동
  const handleJobClick = (id) => navigate(`/jobPosting/${id}`);

  // 로딩 중일 때
  if (loading) return <p>즐겨찾기 목록을 불러오는 중...</p>;
  // 오류 발생 시
  if (error) return <p>{error}</p>;

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>즐겨찾기 목록</h2>
        <div className={styles.favoriteList}>
          {favorites.length > 0 ? (
            favorites.map((favorite) => (
              <div key={favorite.job_posting_id} className={styles.favoriteCard}>
                <h3>{favorite.job_title || "제목 없음"}</h3>
                <p>업종: {favorite.industry || "정보 없음"}</p>
                <p>위치: {favorite.location || "정보 없음"}</p>
                <button
                  className={styles.viewButton}
                  onClick={() => handleJobClick(favorite.job_posting_id)}
                >
                  상세보기
                </button>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFavorite(favorite.job_posting_id)}
                >
                  즐겨찾기 삭제
                </button>
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
