import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./JobPostingList.module.css";
import Paging from "../../components/common/Paging";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
  const [totalItems, setTotalItems] = useState(0);  // 전체 아이템 개수
  const itemsPerPage = 10; // 한 페이지당 항목 수
  const location = useLocation();
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await secureApiRequest(`/api/jobpostings/search?page=${currentPage}&size=${itemsPerPage}`, { method: "GET" });

        console.log("API 응답:", response); // 응답 데이터 확인

        // 응답 데이터 구조를 기준으로 jobPostings 설정
        if (response && response.data && response.data.jobs && response.data.jobs.job) {
          console.log("Job postings:", response.data.jobs.job);  // job 데이터 확인
          setJobPostings(response.data.jobs.job); // 채용공고 데이터 추출
          setTotalItems(response.data.paging?.totalItems || 0); // 전체 항목 개수 설정
        } else {
          console.error("jobPostings 데이터가 없습니다:", response.data);
          setError("채용공고 데이터를 찾을 수 없습니다.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching job postings:", error);
        setError("채용공고를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, [currentPage, secureApiRequest]);

  const handleJobClick = (jobId) => {
    navigate(`/jobpostingdetail/${jobId}`);  // 클릭 시 상세 페이지로 이동
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>채용공고 목록</h2>
      <div className={styles.jobList}>
        {jobPostings.length > 0 ? (
          jobPostings.map((job) => (
            <div key={job.id} className={styles.jobCard} onClick={() => handleJobClick(job.id)}>
              <h3>{job.position.title}</h3>  {/* 채용공고 제목 */}
              
              {/* 위치 (loc_cd, loc_mcd, loc_bcd 사용) */}
              <p>위치: 
                {job.position.loc_cd || "정보 없음"} 
                {job.position.loc_mcd ? `(${job.position.loc_mcd})` : ""}
                {job.position.loc_bcd ? ` > ${job.position.loc_bcd}` : ""}
              </p>

              {/* 직무 (ind_cd, job_mid_cd, job_cd 사용) */}
              <p>직무: 
                {job.position.ind_cd || "정보 없음"} 
                {job.position.job_mid_cd ? `(${job.position.job_mid_cd})` : ""}
                {job.position.job_cd ? ` > ${job.position.job_cd}` : ""}
              </p>

              <p>연봉: {job.salary ? job.salary.name : "정보 없음"}</p>  {/* 연봉 */}
            </div>
          ))
        ) : (
          <p className={styles.noResults}>검색된 채용공고가 없습니다.</p>
        )}
      </div>

      {/* 페이징 컴포넌트 */}
      <Paging
        totalItems={totalItems} // 전체 항목 수
        itemsPerPage={itemsPerPage} // 한 페이지당 항목 수
        currentPage={currentPage} // 현재 페이지
        onPageChange={(page) => setCurrentPage(page)} // 페이지 변경 시 상태 업데이트
      />

      <button className={styles.backButton} onClick={() => navigate("/jobPosting")}>
        검색 페이지로 돌아가기
      </button>
    </div>
  );
};

export default JobPostingList;
