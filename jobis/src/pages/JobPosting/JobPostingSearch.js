import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./JobPostingSearch.module.css";

const JobPostingSearch = () => {
  const { secureApiRequest } = useContext(AuthContext);

  const initialFilters = {
    ind_cd: "",    // 산업/업종 코드
    loc_cd: "",    // 1차 근무지/지역 코드
    loc_mcd: "",   // 2차 근무지/지역 코드
    loc_bcd: "",   // 3차 근무지/지역 코드
    job_mid_cd: "",// 상위 직무 코드
    job_cd: "",    // 직무 코드
    edu_lv: "",    // 학력 수준
    job_type: "",  // 직무 형태 (정규직/파트타임/계약직 등)
    count: 10,     // 한 페이지당 항목 수
    start: 0,      // 검색 시작 페이지
    salary: "",    // 연봉
    experience: "",// 경력
  };

  const [filters, setFilters] = useState(initialFilters);
  const [jobPostings, setJobPostings] = useState([]); // 채용공고 데이터 상태
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await secureApiRequest(`/api/jobpostings/search?${queryParams}`, {
        method: "GET",
      });

      if (response.data) {
        // 응답 데이터에서 채용공고 목록 추출
        setJobPostings(response.data.jobPostings);
        navigate("/jobPostings/search", {
          state: { jobPostings: response.data.jobPostings, filters },
        });
      }
    } catch (error) {
      console.error("채용공고 검색 중 오류가 발생했습니다:", error);
      alert("채용공고 검색 중 오류가 발생했습니다.");
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className={styles.container}>
      <h2>채용공고 검색</h2>
      <div className={styles.filters}>
        <select name="ind_cd" value={filters.ind_cd} onChange={handleInputChange} className={styles.select}>
          <option value="">산업/업종 선택</option>
          <option value="1">서비스업</option>
          <option value="2">제조·화학</option>
          <option value="3">IT·웹·통신</option>
          <option value="4">은행·금융업</option>
          <option value="5">미디어·디자인</option>
          <option value="6">교육업</option>
          <option value="7">의료·제약·복지</option>
          <option value="8">판매·유통</option>
          <option value="9">건설업</option>
          <option value="10">기관·협회</option>
        </select>

        <select
          name="loc_cd"
          value={filters.loc_cd}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">1차 근무지/지역 선택</option>
          <option value="101000">서울</option>
          <option value="102000">경기</option>
          <option value="103000">광주</option>
          <option value="104000">대구</option>
          <option value="105000">대전</option>
          <option value="106000">부산</option>
          <option value="107000">울산</option>
          <option value="108000">인천</option>
        </select>

        <select
          name="loc_mcd"
          value={filters.loc_mcd}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">2차 근무지/지역 선택</option>
          <option value="101">강남</option>
          <option value="102">강북</option>
          <option value="103">서초</option>
        </select>

        <select
          name="loc_bcd"
          value={filters.loc_bcd}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">3차 근무지/지역 선택</option>
          <option value="201">역삼</option>
          <option value="202">교대</option>
          <option value="203">강남구청</option>
        </select>

        <select
          name="job_mid_cd"
          value={filters.job_mid_cd}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">상위 직무 코드 선택</option>
          <option value="A">개발</option>
          <option value="B">디자인</option>
          <option value="C">마케팅</option>
        </select>

        <select
          name="job_cd"
          value={filters.job_cd}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">직무 코드 선택</option>
          <option value="01">소프트웨어 엔지니어</option>
          <option value="02">UI/UX 디자이너</option>
          <option value="03">디지털 마케팅</option>
        </select>

        <select
          name="edu_lv"
          value={filters.edu_lv}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">학력 선택</option>
          <option value="0">학력무관</option>
          <option value="1">고졸이상</option>
          <option value="2">대졸(2,3년)이상</option>
          <option value="3">대졸(4년)이상</option>
          <option value="4">석사이상</option>
          <option value="5">박사이상</option>
        </select>

        <select
          name="job_type"
          value={filters.job_type}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">직무 형태</option>
          <option value="full_time">정규직</option>
          <option value="part_time">파트타임</option>
          <option value="contract">계약직</option>
        </select>

        <select
          name="salary"
          value={filters.salary}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">연봉</option>
          <option value="1">2000만원 이하</option>
          <option value="2">2000만원 ~ 3000만원</option>
          <option value="3">3000만원 ~ 4000만원</option>
          <option value="4">4000만원 ~ 5000만원</option>
          <option value="5">5000만원 이상</option>
        </select>

        <select
          name="experience"
          value={filters.experience}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">경력</option>
          <option value="0">무관</option>
          <option value="1">1년 이하</option>
          <option value="2">1~3년</option>
          <option value="3">3~5년</option>
          <option value="4">5년 이상</option>
        </select>

        <button onClick={handleSearch} className={styles.searchButton}>
          검색
        </button>
        <button onClick={resetFilters} className={styles.resetButton}>
          초기화
        </button>
      </div>

      <div className={styles.results}>
        {jobPostings.length > 0 ? (
          jobPostings.map((job) => (
            <div key={job.job_id} className={styles.jobCard}>
              <h3>{job.title}</h3>
              <p>{job.company_name}</p>
              <p>근무지: {job.location}</p>
              <p>직무: {job.job_type}</p>
              <p>학력: {job.edu_lv}</p>
              <p>마감일: {job.deadline}</p>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default JobPostingSearch;
