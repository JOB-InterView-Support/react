import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./JobPostingList.module.css";
import FavoriteStar from "./FavoriteStar";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

const JobPostingList = () => {
  const { secureApiRequest } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태
  const itemsPerPage = 10; // 한 페이지당 표시할 항목 수

  const fetchJobPostings = async (page) => {
    setLoading(true);
    setError(null);
    const start = (page - 1) * itemsPerPage + 1;

    try {
      const response = await secureApiRequest(
        `/jobposting/search?start=${start}&count=${itemsPerPage}`,
        { method: "GET" }
      );
      setJobPostings(response.data.jobs.job || []);
      setTotalPages(Math.ceil(response.data.jobs.total / itemsPerPage));
    } catch (err) {
      console.error("채용공고 목록을 가져오는 중 오류:", err);
      setError("채용공고 목록을 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await secureApiRequest("/favorites/search", { method: "GET" });
      setFavorites(response?.data || []);
    } catch (err) {
      console.error("즐겨찾기 목록을 가져오는 중 오류:", err);
    }
  };

  useEffect(() => {
    fetchJobPostings(currentPage);
    fetchFavorites();
  }, [currentPage]);

  const toggleFavorite = async (jobPostingId) => {
    try {
      const isFavorited = favorites.some((fav) => fav.jobPostingId === jobPostingId);
      const url = `/favorites${isFavorited ? "/delete" : ""}`;
      const method = isFavorited ? "DELETE" : "POST";

      await secureApiRequest(url, {
        method,
        body: JSON.stringify({ jobPostingId, uuid: "your-uuid" }),
      });

      setFavorites((prevFavorites) =>
        isFavorited
          ? prevFavorites.filter((fav) => fav.jobPostingId !== jobPostingId)
          : [...prevFavorites, { jobPostingId }]
      );
    } catch (err) {
      console.error("즐겨찾기 변경 중 오류:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>채용공고 목록</h2>
        <div className={styles.jobList}>
          {jobPostings.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <h3>{job.position?.title || "제목 없음"}</h3>
              <p>회사: {job.company?.detail?.name || "정보 없음"}</p>
              <p>위치: {job.position?.location?.name || "정보 없음"}</p>
              <p>급여: {job.salary?.name || "정보 없음"}</p>
              <p>마감일: {job.expirationDate || "정보 없음"}</p>
              <FavoriteStar
                favorited={favorites.some((fav) => fav.jobPostingId === job.id)}
                onToggle={() => toggleFavorite(job.id)}
              />
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPostingList;
