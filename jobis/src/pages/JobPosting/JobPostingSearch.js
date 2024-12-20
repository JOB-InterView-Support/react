import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from "../../utils/axios";
import styles from './JobPostingSearch.module.css';

const JobPostingSearch = () => {
  const [searchParams, setSearchParams] = useState({ keywords: '', loc_cd: '' });
  const [jobResults, setJobResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/job-postings/search', {
        params: searchParams,
      });
      setJobResults(response); // 응답 데이터를 상태에 저장
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>채용공고 검색</h1>
      <div className={styles.searchForm}>
        <input
          type="text"
          placeholder="키워드 입력"
          value={searchParams.keywords}
          onChange={(e) => setSearchParams({ ...searchParams, keywords: e.target.value })}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="지역 코드 입력"
          value={searchParams.loc_cd}
          onChange={(e) => setSearchParams({ ...searchParams, loc_cd: e.target.value })}
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>
          검색
        </button>
      </div>

      {loading && <p className={styles.message}>로딩 중...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <ul className={styles.jobList}>
        {jobResults.map((job) => (
          <li
            key={job.id}
            className={styles.jobItem}
            onClick={() => navigate(`/job-postings/${job.id}`)}
          >
            <h2 className={styles.jobTitle}>{job.title}</h2>
            <p className={styles.jobCompany}>{job.companyName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobPostingSearch;