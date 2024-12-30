import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./JobPostingList.module.css";
import Paging from "../../components/common/Paging";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]); // 채용공고 상태
  const [favorites, setFavorites] = useState([]); // 즐겨찾기 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalItems, setTotalItems] = useState(0); // 전체 아이템 수
  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수
  const navigate = useNavigate();
  const { secureApiRequest, uuid } = useContext(AuthContext); // uuid 추가

  // API 데이터 가져오기
  useEffect(() => {
    const fetchJobPostings = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching job postings...");
        const response = await secureApiRequest(
          `/jobposting/search?page=${currentPage - 1}&size=${itemsPerPage}`,
          { method: "GET" }
        );

        // 응답 데이터 구조에 맞춰서 데이터 처리
        if (response?.data?.jobs?.job) {
          setJobPostings(response.data.jobs.job); // 채용공고 데이터 설정
          setTotalItems(response.data.totalItems); // 전체 아이템 수 설정
        } else {
          setError("채용공고 데이터를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("채용공고를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        console.log("즐겨찾기 데이터를 가져옵니다. 사용자 UUID:", uuid);
        const response = await secureApiRequest(`/favorites/search?uuid=${uuid}`, { method: "GET" });
        console.log("가져온 즐겨찾기 응답 데이터:", response);
        setFavorites(response?.data || []); // 즐겨찾기 목록 설정
      } catch (err) {
        console.error("즐겨찾기 데이터를 가져오는 중 오류 발생:", err);
      }
   };

    fetchJobPostings();
    fetchFavorites();
  }, [currentPage, uuid, secureApiRequest]);

  // 즐겨찾기 추가/삭제
  const toggleFavorite = async (jobPostingId, event) => {
    event.stopPropagation(); // 클릭 이벤트 전파 방지
    try {
      console.log("즐겨찾기 상태를 변경합니다. 채용 공고 ID:", jobPostingId);
      // 이미 즐겨찾기에 있는 경우 삭제, 없으면 추가
      if (favorites.some((fav) => fav.job_posting_id === jobPostingId)) {
        console.log("즐겨찾기에서 삭제 중... 채용 공고 ID:", jobPostingId);
        // 즐겨찾기 삭제
        await secureApiRequest(`/favorites/${jobPostingId}`, { method: "DELETE" });
        setFavorites(favorites.filter((fav) => fav.job_posting_id !== jobPostingId));
        console.log("즐겨찾기에서 삭제 완료. 채용 공고 ID:", jobPostingId);
      } else {
        console.log("즐겨찾기에 추가 중... 채용 공고 ID:", jobPostingId);
        // 즐겨찾기 추가 시 job_favorites_no를 명시적으로 추가
        await secureApiRequest(`/favorites`, {
          method: "POST",
          body: JSON.stringify({
            job_posting_id: jobPostingId,
            job_favorites_no: "generatedValue",  // 이 값을 자동 생성하거나, 시퀀스를 사용하여 삽입할 수 있음
          }),
        });
        setFavorites([...favorites, { job_posting_id: jobPostingId }]);
        console.log("즐겨찾기에 추가 완료. 채용 공고 ID:", jobPostingId);
      }
    } catch (err) {
      console.error("즐겨찾기 상태 변경 중 오류 발생:", err);
    }
  };

  // 채용공고 상세보기로 이동
  const handleJobClick = (id) => navigate(`/jobPosting/${id}`);

  // 로딩 중일 때
  if (loading) return <p>채용공고 목록을 불러오는 중...</p>;
  // 오류 발생 시
  if (error) return <p>{error}</p>;

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>채용공고 목록</h2>
        <div className={styles.jobList}>
          {jobPostings.length > 0 ? (
            jobPostings.map((job) => (
              <div
                key={job.id}
                className={styles.jobCard}
                onClick={() => handleJobClick(job.id)} // 카드 클릭 시 상세보기로 이동
              >
                <h3>{job.position?.title || "제목 없음"}</h3>
                <p>업종: {job.position?.industry?.name || "정보 없음"}</p>
                <p>위치: {job.position?.location?.name || "정보 없음"}</p>
                <p>연봉: {job.salary?.name || "정보 없음"}</p>
                <div
                  className={`${styles.favoriteIcon} ${
                    favorites.some((fav) => fav.job_posting_id === job.id) ? styles.favorited : ""
                  }`}
                  onClick={(e) => toggleFavorite(job.id, e)} // 별 클릭 시 즐겨찾기 추가/삭제
                >
                  {/* 즐겨찾기 아이콘 */}
                  {favorites.some((fav) => fav.job_posting_id === job.id) ? "★" : "☆"}
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
  );
};

export default JobPostingList;
