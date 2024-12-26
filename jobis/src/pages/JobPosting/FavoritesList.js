import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./FavoritesList.module.css";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/jobpostings/favorites');
        setFavorites(response.data.favorites || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (jobId) => {
    try {
      await axios.delete(`http://localhost:8080/api/jobpostings/favorites/${jobId}`);
      setFavorites(prevFavorites => 
        prevFavorites.filter(favorite => favorite.id !== jobId)
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('즐겨찾기 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>즐겨찾기 목록</h2>

      <div className={styles.favoritesList}>
        {favorites.length > 0 ? (
          favorites.map((job) => (
            <div key={job.id} className={styles.favoriteCard}>
              <div className={styles.jobInfo}>
                <h3>{job.company.name}</h3>
                <h4>{job.position}</h4>
                <p>{job.location}</p>
                <p className={styles.deadline}>
                  마감일: {new Date(job.expireDate).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.buttons}>
                <button
                  className={styles.viewButton}
                  onClick={() => navigate(`/jobpostingdetail/${job.id}`)}
                >
                  상세보기
                </button>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveFavorite(job.id)}
                >
                  즐겨찾기 삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noFavorites}>즐겨찾기한 채용공고가 없습니다.</p>
        )}
      </div>

      <button 
        className={styles.backButton}
        onClick={() => navigate('/jobPosting')}
      >
        검색 페이지로 돌아가기
      </button>
    </div>
  );
};

export default FavoritesList;