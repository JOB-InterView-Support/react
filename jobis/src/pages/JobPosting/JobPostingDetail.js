import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../AuthProvider";
import { useParams } from 'react-router-dom';
import styles from './JobPostingDetail.module.css';

const JobPostingDetail = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const { secureApiRequest } = useContext(AuthContext);

  const fetchJobDetails = async () => {
    try {
      const response = await secureApiRequest(`/jobposting/search?&id=${jobId}`, { method: "GET" });
      console.log("Full API Response:", response); // 전체 응답 확인
      const jobData = response.data.jobs.job[0];
      console.log("Parsed Job Data:", jobData); // 파싱된 데이터 확인
      setJobDetails(jobData);
    } catch (error) {
      console.error("Error fetching job details:", error); // 에러 로그
    }
  };

  useEffect(() => {
    console.log("Fetching job details for jobId:", jobId); // jobId 확인
    fetchJobDetails();
  }, [jobId]);

  if (!jobDetails) {
    return <div>Loading...</div>;
  }

  // 데이터 구조에서 필요한 정보 추출
  const {
    position,
    company,
    salary,
    location,
    postingTimestamp,
    modificationTimestamp,
    expirationTimestamp,
    active,
    keyword,
    url,
  } = jobDetails;

  // 타임스탬프 처리
  const postingDateFormatted = postingTimestamp ? new Date(postingTimestamp * 1000).toLocaleDateString() : "정보 없음";
  const modificationDateFormatted = modificationTimestamp ? new Date(modificationTimestamp * 1000).toLocaleDateString() : "정보 없음";
  const expirationDateFormatted = expirationTimestamp ? new Date(expirationTimestamp * 1000).toLocaleDateString() : "정보 없음";

  // 기타 정보 추출
  const companyName = company?.detail?.name || "정보 없음";
  const companyUrl = company?.detail?.href || "#";
  const locationName = position?.location?.name.replace(/&gt;/g, '>') || "정보 없음";
  const jobType = position?.['job-type']?.name || "정보 없음";
  const salaryText = salary?.name || "면접후 결정";
  const experienceLevel = position?.['experience-level']?.name || "경력무관";
  const industry = position?.industry?.name || "정보 없음";
  const jobMidCode = position?.['job-mid-code']?.name || "정보 없음";

  console.log("Final Rendered Job Details:", {
    position,
    company,
    salary,
    location,
    postingTimestamp,
    modificationTimestamp,
    expirationTimestamp,
    active,
    keyword,
    url,
  });

  return (
    <div>
      <h1>{position?.title || "채용공고 정보 없음"}</h1>
      <p><strong>회사:</strong> <a href={companyUrl} target="_blank" rel="noopener noreferrer">{companyName}</a></p>
      <p><strong>위치:</strong> {locationName}</p>
      <p><strong>직무:</strong> {jobType}</p>
      <p><strong>급여:</strong> {salaryText}</p>
      <p><strong>경력 요구:</strong> {experienceLevel}</p>
      <p><strong>업종:</strong> {industry}</p>
      <p><strong>중분류 직무 코드:</strong> {jobMidCode}</p>
      <p><strong>게시일:</strong> {postingDateFormatted}</p>
      <p><strong>수정일:</strong> {modificationDateFormatted}</p>
      <p><strong>마감일:</strong> {expirationDateFormatted}</p>
      <p><strong>활성화 상태:</strong> {active ? "활성화됨" : "비활성화됨"}</p>
      <p><strong>키워드:</strong> {keyword || "정보 없음"}</p>
      <p><strong>채용 공고 링크:</strong> <a href={url} target="_blank" rel="noopener noreferrer">상세보기</a></p>
    </div>
  );
};

export default JobPostingDetail;
