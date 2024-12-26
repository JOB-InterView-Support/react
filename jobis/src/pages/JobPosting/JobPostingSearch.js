import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import styles from "./JobPostingSearch.module.css";

const JobPostingSearch = () => {
  const { isLoggedIn } = useContext(AuthContext); // 로그인 상태 확인
  const [filters, setFilters] = useState({
    ind_cd: "", // 산업/업종 코드
    loc_cd: "", // 지역 코드
    edu_lv: "", // 학력 코드
    job_type: "", // 경력 코드
    count: "",
    start: "",
    sort: "",
  });
  const navigate = useNavigate();

  // 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input Changed: ${name} = ${value}`);  // 로그 추가
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      console.log("Updated Filters:", updatedFilters);  // 상태 업데이트 후 로그 추가
      return updatedFilters;
    });
  };

  // 필터 초기화
  const resetFilters = () => {
    console.log("Resetting filters...");  // 로그 추가
    setFilters({
      ind_cd: "",
      loc_cd: "",
      edu_lv: "",
      job_type: "",
      count: 10,
      start: 0,
      sort: "ud",
    });
  };

  // 검색 실행
  const searchJobs = () => {
    const { ind_cd, loc_cd, edu_lv, job_type } = filters;
  
    // 빈 값은 쿼리에서 제외하기 위한 처리
    const queryParams = new URLSearchParams();
  
    if (ind_cd) queryParams.append("ind_cd", ind_cd);
    if (loc_cd) queryParams.append("loc_cd", loc_cd);
    if (edu_lv) queryParams.append("edu_lv", edu_lv);
    if (job_type) queryParams.append("job_type", job_type);
  
    // 쿼리 문자열 생성
    const queryString = queryParams.toString();
  
    // 최종 URL로 이동
    navigate(`/jobPostings/search?${queryString}`);
  };

  // 로그인 상태 확인
  useEffect(() => {
    console.log("Checking login status...");  // 로그인 상태 체크 시 로그 추가
    if (!isLoggedIn) {
      console.log("User is not logged in. Redirecting to login page.");  // 로그인되지 않으면 로그 추가
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className={styles.container}>
      <h2>채용공고 검색</h2>

      {/* 필터 섹션 */}
      <div className={styles.filters}>
        <select
          name="ind_cd"
          value={filters.ind_cd}
          onChange={handleInputChange}
          className={styles.select}
        >
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
          <option value="">지역 선택</option>
          <option value="117000">전국</option>
          <option value="101000">서울전체</option>
          <option value="102000">경기전체</option>
          <option value="103000">광주전체</option>
          <option value="104000">대구전체</option>
          <option value="105000">대전전체</option>
          <option value="106000">부산전체</option>
          <option value="107000">울산전체</option>
          <option value="108000">인천전체</option>
          <option value="109000">강원전체</option>
          <option value="110000">경남전체</option>
          <option value="111000">경북전체</option>
          <option value="112000">전남전체</option>
          <option value="113000">전북전체</option>
          <option value="114000">충북전체</option>
          <option value="115000">충남전체</option>
          <option value="116000">제주전체</option>
          <option value="118000">세종전체</option>
        </select>

        {/* 학력 선택 필터 */}
        <select
          name="edu_lv"
          value={filters.edu_lv}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">학력 선택</option>
          <option value="1">고등학교 졸업</option>
          <option value="2">대학(2·3년제) 졸업</option>
          <option value="3">대학(4년제) 졸업</option>
          <option value="4">대학원 졸업</option>
        </select>

        {/* 경력 선택 필터 */}
        <select
          name="job_type"
          value={filters.job_type}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="">경력 선택</option>
          <option value="1">신입</option>
          <option value="2">경력 1~3년</option>
          <option value="3">경력 3~5년</option>
          <option value="4">경력 5년 이상</option>
        </select>
      </div>

      {/* 버튼 섹션 */}
      <div className={styles.buttons}>
        <button onClick={searchJobs} className={styles.searchButton}>
          검색
        </button>
        <button onClick={resetFilters} className={styles.resetButton}>
          초기화
        </button>
      </div>
    </div>
  );
};

export default JobPostingSearch;
