import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from "../../utils/axios";
import styles from './JobPostingDetail.module.css';

const JobPostingDetail = () => {
  const { id } = useParams();
  const [jobDetail, setJobDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get(`/job-postings/${id}`);
        setJobDetail(response);
      } catch (err) {
        setError('상세 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (loading) return <p className={styles.message}>로딩 중...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!jobDetail) return <p className={styles.message}>데이터가 없습니다.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{jobDetail.title}</h1>
      <p className={styles.detail}>회사명: {jobDetail.companyName}</p>
      <p className={styles.detail}>위치: {jobDetail.location}</p>
      <p className={styles.detail}>직무: {jobDetail.jobDescription}</p>
      <p className={styles.detail}>마감일: {jobDetail.deadline}</p>
    </div>
  );
};

export default JobPostingDetail;
