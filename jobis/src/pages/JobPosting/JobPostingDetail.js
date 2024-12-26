import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./JobPostingDetail.module.css";

const JobPostingDetail = () => {
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/jobpostings/detail/${id}`);
        setJobDetail(response.data.jobDetail);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job detail:', error);
        setError('채용공고 상세 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!jobDetail) return <div className={styles.notFound}>채용공고를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{jobDetail.position}</h2>
        <h3>{jobDetail.company.name}</h3>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h4>기업 정보</h4>
          <p>업종: {jobDetail.company.industry}</p>
          <p>규모: {jobDetail.company.size}</p>
          <p>위치: {jobDetail.location}</p>
        </section>

        <section className={styles.section}>
          <h4>채용 조건</h4>
          <p>고용형태: {jobDetail.employmentType}</p>
          <p>경력: {jobDetail.experience}</p>
          <p>학력: {jobDetail.education}</p>
          <p>급여: {jobDetail.salary}</p>
        </section>

        <section className={styles.section}>
          <h4>상세 내용</h4>
          <div 
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: jobDetail.description }}
          />
        </section>

        <section className={styles.section}>
          <h4>지원 방법</h4>
          <p>마감일: {new Date(jobDetail.expireDate).toLocaleDateString()}</p>
          <p>지원방법: {jobDetail.applicationMethod}</p>
        </section>
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.applyButton}
          onClick={() => window.open(jobDetail.applyUrl, '_blank')}
        >
          지원하기
        </button>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default JobPostingDetail;