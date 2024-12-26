import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./JobPostingSearch.module.css";

const JobPostingSearch = () => {
  const { secureApiRequest } = useContext(AuthContext); // secureApiRequest 사용
  const [filters, setFilters] = useState({
    ind_cd: "",
    loc_cd: "",
    edu_lv: "",
    job_type: "",
    count: 10,
    start: 0,
  });

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();

      // secureApiRequest를 사용하여 API 호출
      const response = await secureApiRequest(
        `/api/jobpostings/search?${queryParams}`,
        {
          method: "GET"
        }
      );

      if (response.data) {
        navigate('/jobPostings/search', { 
          state: { 
            jobPostings: response.data.jobPostings,
            filters: filters
          }
        });
      }
    } catch (error) {
      console.error("채용공고 검색 중 오류가 발생했습니다:", error);
      alert("채용공고 검색 중 오류가 발생했습니다.");
    }
  };

  const resetFilters = () => {
    setFilters({
      ind_cd: "",
      loc_cd: "",
      edu_lv: "",
      job_type: "",
      count: 10,
      start: 0,
    });
  };

  return (
    <div className={styles.container}>
      <h2>채용공고 검색</h2>
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
          <option value="">직무 선택</option>
          <option value="full_time">정규직</option>
          <option value="part_time">파트타임</option>
          <option value="contract">계약직</option>
        </select>

        <button onClick={handleSearch} className={styles.searchButton}>검색</button>
        <button onClick={resetFilters} className={styles.resetButton}>초기화</button>
      </div>
    </div>
  );
};

export default JobPostingSearch;
