import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./FavoritesList.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";
import FavoriteStar from "./FavoriteStar";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const uuid = localStorage.getItem("uuid");

  console.log("로컬스토리지에서 가져온 UUID:", uuid);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const favoritesResponse = await secureApiRequest(
          `/favorites/search?uuid=${uuid}`,
          { method: "GET" }
        );

        const favoritesData = favoritesResponse?.data || [];
        const favoritesWithDetails = await Promise.all(
          favoritesData.map(async (favorite) => {
            try {
              const jobResponse = await secureApiRequest(
                `/jobposting/${favorite.jobPostingId}`,
                { method: "GET" }
              );

              const jobData = jobResponse?.data || {};
              const position = jobData?.position || {};

              return {
                ...favorite,
                jobTitle: position?.title || "제목 없음",
                industry: position?.industry?.name || "정보 없음",
                location: position?.location?.name || "정보 없음",
                salary: jobData?.salary?.name || "정보 없음",
                company: jobData?.company?.detail?.name || "정보 없음",
              };
            } catch (error) {
              console.error("채용공고 상세 조회 실패:", error);
              return {
                ...favorite,
                jobTitle: "제목 없음",
                industry: "정보 없음",
                location: "정보 없음",
                salary: "정보 없음",
                company: "정보 없음",
              };
            }
          })
        );

        setFavorites(favoritesWithDetails);
      } catch (err) {
        console.error("즐겨찾기 데이터 조회 실패:", err);
        setError("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [uuid, secureApiRequest]);

  const removeFavorite = async (jobPostingId) => {
    try {
      await secureApiRequest(
        `/favorites/delete?uuid=${uuid}&jobPostingId=${jobPostingId}`,
        { method: "DELETE" }
      );

      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.jobPostingId !== jobPostingId)
      );
    } catch (err) {
      console.error("즐겨찾기 삭제 실패:", err);
      alert("즐겨찾기 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleJobClick = (id) => {
    navigate(`/jobPosting/${id}`);
  };

  if (loading) {
    return <p>즐겨찾기 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>즐겨찾기 목록</h2>
        <div className={styles.table}>
          <div className={styles.favoriteList}>
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <div key={favorite.jobFavoritesNo} className={styles.favoriteCard}>
                  <div className={styles.cardHeader}>
                    <h3>{favorite.jobTitle}</h3>
                    <span className={styles.company}>{favorite.company}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <p>업종: {favorite.industry}</p>
                    <p>위치: {favorite.location}</p>
                    <p>연봉: {favorite.salary}</p>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleJobClick(favorite.jobPostingId)}
                    >
                      상세보기
                    </button>
                    <FavoriteStar
                      initialFavorited={true}
                      onToggle={() => removeFavorite(favorite.jobPostingId)}
                      jobPostingId={favorite.jobPostingId}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>즐겨찾기한 채용공고가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesList;
