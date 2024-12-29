import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./JobPostingList.module.css";
import Paging from "../../components/common/Paging";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [favorites, setFavorites] = useState([]); // 즐겨찾기 상태 관리
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수
  const { uuid } = useContext(AuthContext);
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchJobPostings = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching job postings...");
        const response = await secureApiRequest(
          `/jobposting/search?page=${currentPage -1}&size=${itemsPerPage}`,
          { method: "GET" }
        );

        console.log("API Response:", response);  // Log the entire response
        console.log("Job postings data:", response.data);

        if (response?.data?.jobs?.job) {
          console.log("Job postings data:", response.data.jobs.job); // Log the job data
          setJobPostings(response.data.jobs.job);
          setTotalItems(response.data.totalItems);
        } else {
          console.log("Error: No job data found");
          setError("채용공고 데이터를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("Error fetching job postings:", err); // Log any errors
        setError("채용공고를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, [currentPage, secureApiRequest]);

   // 즐겨찾기 데이터 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await secureApiRequest(`/favorites/${uuid}`, { method: "GET" });
        setFavorites(response?.data || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [secureApiRequest]);

    // 즐겨찾기 추가/삭제
  const toggleFavorite = async (jobPostingId) => {
    try {
      if (favorites.some((fav) => fav.job_posting_id === jobPostingId)) {
        await secureApiRequest(`/favorites/${jobPostingId}`, { method: "DELETE" });
        setFavorites(favorites.filter((fav) => fav.job_posting_id !== jobPostingId));
      } else {
        await secureApiRequest(`/favorites`, {
          method: "POST",
          body: JSON.stringify({ job_posting_id: jobPostingId }),
        });
        setFavorites([...favorites, { job_posting_id: jobPostingId }]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  // 채용공고 상세보기로 이동
  const handleJobClick = (id) => navigate(`/jobPosting/${id}`);

  // 로딩 중일 때
  if (loading) return <p>채용공고 목록을 불러오는 중...</p>;
  // 오류 발생 시
  if (error) return <p>채용공고 목록을 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div className={styles.container}>
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
              <div
                className={`${styles.favoriteIcon} ${
                  favorites.some((fav) => fav.job_posting_id === job.id)
                    ? styles.favorited
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 방지
                  toggleFavorite(job.id);
                }}
              >
                ★
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
        onPageChange={(page) => {
          console.log("Changing page to:", page);  // 페이지 변경 로그
          setCurrentPage(page);
        }}
      />
    )}
    </div>
  );
};

export default JobPostingList;
