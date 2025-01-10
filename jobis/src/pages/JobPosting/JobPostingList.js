import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./JobPostingList.module.css";
import Paging from "../../components/common/Paging";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";
import FavoriteStar from "./FavoriteStar"; // Import the FavoriteStar component
import apiClient from "../../utils/axios";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { secureApiRequest, uuid } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobPostings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await secureApiRequest(
          `/jobposting/search?page=${currentPage - 1}&size=${itemsPerPage}`,
          { method: 'GET' }
        );
        if (response?.data?.jobs?.job) {
          setJobPostings(response.data.jobs.job);
          setTotalItems(response.data.totalItems);
        } else {
          setError('채용공고 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('채용공고를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (uuid) {
        try {
          const response = await secureApiRequest(`/favorites/search?uuid=${uuid}`, { method: 'GET' });
          setFavorites(response?.data || []);
        } catch (err) {
          console.error('즐겨찾기 데이터를 가져오는 중 오류 발생:', err);
        }
      }
    };

    fetchJobPostings();
    fetchFavorites();
  }, [currentPage, uuid, secureApiRequest]);

  const toggleFavorite = async (jobPostingId, newFavoritedState) => {
    try {
      if (newFavoritedState) {
        const favoriteData = {
          jobFavoritesNo: crypto.randomUUID(),
          uuid: uuid,
          jobPostingId: jobPostingId,
          jobCreatedDate: new Date().toISOString()
        };

        const response = await secureApiRequest(
          `/favorites`, 
          { 
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(favoriteData), // 데이터를 body에 포함
          }
        );
        if (response?.data) {
          setFavorites([...favorites, response.data]);
        }
      } else {
        await apiClient.delete(`/favorites/delete`, {
          params: {
            uuid: uuid,
            jobPostingId: jobPostingId,
          },
        });
        setFavorites(favorites.filter(fav => fav.jobPostingId !== jobPostingId));
      }
    } catch (err) {
      console.error("즐겨찾기 상태 변경 중 오류 발생:", err);
    }
  };

  const handleJobClick = (id) => navigate(`/jobPosting/${id}`);

  if (loading) return <p>채용공고 목록을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <div table={styles.table}>
        <h2>채용공고 목록</h2>
        <div className={styles.jobList}>
          {jobPostings.length > 0 ? (
            jobPostings.map((job) => (
              <div
                key={job.id}
                className={styles.jobCard}
                onClick={() => handleJobClick(job.id)}
              >
                <h3>{job.position?.title || "제목 없음"}</h3>
                <p>업종: {job.position?.industry?.name || "정보 없음"}</p>
                <p>위치: {job.position?.location?.name || "정보 없음"}</p>
                <p>연봉: {job.salary?.name || "정보 없음"}</p>
                <div className={styles.favoriteIcon}>
                  <FavoriteStar
                    initialFavorited={favorites.some(fav => fav.jobPostingId === job.id)} 
                    onToggle={(newFavoritedState) => toggleFavorite(job.id, newFavoritedState)} 
                    jobPostingId={job.id}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>검색된 채용공고가 없습니다.</p>
          )}
        </div>
        {totalItems > 0 && (
          <Paging
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default JobPostingList;