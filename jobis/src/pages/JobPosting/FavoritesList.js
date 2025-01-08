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
  const { secureApiRequest, isLoggedIn } = useContext(AuthContext);
  const [uuid, setUuid] = useState(null); // uuid 상태

  // 컴포넌트가 마운트될 때 uuid를 localStorage에서 가져옴
  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    if (storedUuid) {
      setUuid(storedUuid);
    }
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!uuid || !isLoggedIn) return;  // uuid와 로그인 상태가 모두 필요한 조건

      setLoading(true);
      setError(null);
      try {
        // 즐겨찾기 목록 가져오기
        const favoritesResponse = await secureApiRequest(
          `/favorites/search?uuid=${uuid}`,
          { method: "GET" }
        );

        if (!favoritesResponse || !favoritesResponse.data) {
          setFavorites([]);
          return;
        }

        // 즐겨찾기 목록에 포함된 각 채용공고의 상세 정보를 가져오기
        const favoritesWithDetails = await Promise.all(
          favoritesResponse.data.map(async (favorite) => {
            const jobResponse = await secureApiRequest(
              `/${favorite.jobPostingId}`,
              { method: "GET" }
            );
            const jobData = jobResponse?.data?.jobs?.job || null;
            return {
              ...favorite,
              jobTitle: jobData?.position?.title || "제목 없음",
              industry: jobData?.position?.industry?.name || "정보 없음",
              location: jobData?.position?.location?.name || "정보 없음",
              salary: jobData?.salary?.name || "정보 없음",
              company: jobData?.company?.detail?.name || "정보 없음",
            };
          })
        );
  
        setFavorites(favoritesWithDetails);
      } catch (err) {
        setError("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFavorites();
  }, [uuid, isLoggedIn, secureApiRequest]);

  // 즐겨찾기 삭제 함수
  const removeFavorite = async (jobPostingId) => {
    try {
      // 즐겨찾기에서 공고 제거
      await secureApiRequest(
        `/favorites/delete?uuid=${uuid}&jobPostingId=${jobPostingId}`,
        { method: "DELETE" }
      );
      // 로컬 상태에서 해당 즐겨찾기 제거
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.jobPostingId !== jobPostingId)
      );
    } catch (err) {
      alert("즐겨찾기 삭제 중 오류가 발생했습니다.");
    }
  };

  // 채용공고 상세보기 페이지로 이동
  const handleJobClick = (id) => {
    navigate(`/jobPosting/${id}`);
  };

  if (loading) return <p>즐겨찾기 목록을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>즐겨찾기 목록</h2>
        <div className={styles.favoriteList}>
          {favorites.length > 0 ? (
            favorites.map((favorite) => (
              <div key={favorite.jobPostingId} className={styles.favoriteCard}>
                <div className={styles.cardHeader}>
                  <h3>{favorite.position?.title}</h3>
                  <span className={styles.company}>{favorite.company}</span>
                </div>
                <div className={styles.cardContent}>
                  <p>업종: {favorite.position?.industry?.code}</p>
                  <p>위치: {favorite.position?.location?.code}</p>
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
                    initialFavorited={true} // 기본값을 favorites 배열로 확인하여 설정
                    onToggle={() => removeFavorite(favorite.jobPostingId)} // 즐겨찾기 제거 로직으로 대체
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
  );
};

export default FavoritesList;