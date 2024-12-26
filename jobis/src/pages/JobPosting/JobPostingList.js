import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import styles from "./JobPostingList.module.css";

const JobPostingList = ({ filters }) => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 채용 공고 검색 API 호출
  const fetchJobPostings = async () => {
    console.log("필터를 사용하여 채용 공고를 가져옵니다:", filters);
    
    try {
      const response = await axios.get("https://oapi.saramin.co.kr/job-search", {
        params: {
          ...filters,  // 필터 값 전달
          count: 10,  // 한 번에 가져올 공고 수
          start: 0,   // 페이지 번호
        },
      });

      console.log("API 응답:", response);  // API 응답 전체 출력
      setJobPostings(response.data.job_postings);  // 채용 공고 목록 저장
    } catch (error) {
      console.error("채용 공고를 가져오는 중 오류 발생:", error);
      setError("채용 공고를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
      console.log("로딩 상태가 false로 설정되었습니다.");
    }
  };

  // 페이지 로딩 후 API 호출
  useEffect(() => {
    console.log("필터가 변경되어 채용 공고를 다시 가져옵니다...");
    fetchJobPostings();
  }, [filters]);  // filters가 변경될 때마다 재호출

  const handleJobDetail = (id) => {
    console.log(`채용 공고 상세 페이지로 이동합니다. 공고 ID: ${id}`);
    navigate(`/jobpostingdetail/${id}`);  // 채용 공고 상세 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <h2>채용 공고 목록</h2>

      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : jobPostings.length === 0 ? (
        <div className={styles.noResults}>검색된 채용 공고가 없습니다.</div>
      ) : (
        <div className={styles.jobList}>
          {jobPostings.map((job) => (
            <div
              key={job.id}
              className={styles.jobCard}
              onClick={() => handleJobDetail(job.id)}
            >
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p className={styles.jobCompany}>{job.company_name}</p>
              <p className={styles.jobLocation}>{job.location}</p>
              <p className={styles.jobDate}>마감일: {job.deadline}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate("/JobPostingSearch")} className={styles.backButton}>
        검색 페이지로 돌아가기
      </button>
    </div>
  );
};

export default JobPostingList;
