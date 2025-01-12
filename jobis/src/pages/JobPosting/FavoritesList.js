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
  const uuid = localStorage.getItem('uuid');  // 로컬스토리지에서 uuid 가져옴

  console.log("로컬스토리지에서 가져온 UUID:", uuid); // UUID 확인

  useEffect(() => {
    const fetchFavorites = async () => {
      console.log("즐겨찾기 데이터를 불러오는 중...");

      setLoading(true);
      setError(null);

      try {
        console.log("즐겨찾기 API 요청 시작...");
        const favoritesResponse = await secureApiRequest(
          `/favorites/search?uuid=${uuid}`,
          { method: "GET" }
        );
        console.log("즐겨찾기 응답:", favoritesResponse); // 응답 확인

        if (!favoritesResponse?.data) {
          console.log("응답 데이터가 없어서 빈 배열로 설정");
          setFavorites([]);
          return;
        }

        const favoritesWithDetails = await Promise.all(
          favoritesResponse.data.map(async (favorite) => {
            console.log("즐겨찾기 항목 데이터:", favorite);

            try {
              console.log(`채용공고 상세 조회 시작 (ID: ${favorite.jobPostingId})`);
              const jobResponse = await secureApiRequest(
                `/jobposting/${favorite.jobPostingId}`,
                { method: "GET" }
              );
              console.log(`채용공고 상세 응답 (ID: ${favorite.jobPostingId}):`, jobResponse);

              const jobData = jobResponse?.data?.jobs?.job || null;

              return {
                ...favorite,
                jobTitle: jobData?.position?.title || "제목 없음",
                industry: jobData?.position?.industry?.name || "정보 없음",
                location: jobData?.position?.location?.name || "정보 없음",
                salary: jobData?.salary?.name || "정보 없음",
                company: jobData?.company?.detail?.name || "정보 없음"
              };
            } catch (error) {
              console.error("채용공고 상세 정보 조회 실패:", error);
              return {
                ...favorite,
                jobTitle: "제목 없음",
                industry: "정보 없음",
                location: "정보 없음",
                salary: "정보 없음",
                company: "정보 없음"
              };
            }
          })
        );

        console.log("최종적으로 세팅된 즐겨찾기 목록:", favoritesWithDetails);
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
      console.log("UUID가 없으므로 즐겨찾기 데이터를 불러오지 않음");
      setLoading(false);
    }
  }, [uuid, secureApiRequest]);

  const removeFavorite = async (jobPostingId) => {
    console.log(`즐겨찾기 삭제 요청 (ID: ${jobPostingId})`);
    try {
      await secureApiRequest(
        `/favorites/delete?uuid=${uuid}&jobPostingId=${jobPostingId}`,
        { method: "DELETE" }
      );
      console.log(`즐겨찾기 삭제 완료 (ID: ${jobPostingId})`);

      setFavorites(prevFavorites =>
        prevFavorites.filter(fav => fav.jobPostingId !== jobPostingId)
      );
    } catch (err) {
      console.error("즐겨찾기 삭제 실패:", err);
      alert("즐겨찾기 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleJobClick = (id) => {
    console.log(`채용공고 상세보기 클릭 (ID: ${id})`);
    navigate(`/jobPosting/${id}`);
  };

  if (loading) {
    console.log("즐겨찾기 목록을 불러오는 중...");
    return <p>즐겨찾기 목록을 불러오는 중...</p>;
  }

  if (error) {
    console.error("오류 발생:", error);
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
