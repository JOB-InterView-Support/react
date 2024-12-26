import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";  // AuthContext 가져오기
import styles from "./JobPostingList.module.css";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext); // secureApiRequest 사용

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        if (location.state?.jobPostings) {
          setJobPostings(location.state.jobPostings);
          setLoading(false);
        } else {
          // 상태가 없는 경우 기본 검색 수행
          const response = await secureApiRequest(
            'http://localhost:8080/api/jobpostings/search', {
              method: 'GET',
            }
          );

          setJobPostings(response.data.jobPostings || []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching job postings:', error);
        setError('채용공고를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, [location.state, secureApiRequest]);

  const handleJobClick = (jobId) => {
    navigate(`/jobpostingdetail/${jobId}`);
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

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
              <h3>{job.company.name}</h3>
              <h4>{job.position}</h4>
              <p>{job.location}</p>
              <div className={styles.jobInfo}>
                <span>경력: {job.experience}</span>
                <span>학력: {job.education}</span>
              </div>
              <p className={styles.deadline}>
                마감일: {new Date(job.expireDate).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>검색된 채용공고가 없습니다.</p>
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

export default JobPostingList;
