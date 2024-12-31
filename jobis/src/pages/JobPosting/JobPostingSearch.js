import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./JobPostingSearch.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

const JobPostingSearch = () => {
  const { secureApiRequest, uuid } = useContext(AuthContext); // uuid 가져오기
  const initialFilters = {
    ind_cd: "",
    loc_cd: "",
    edu_lv: "",
    job_cd: "",
  };
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 필터 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 검색 핸들러
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();

      // 필터 값이 있을 경우만 쿼리 문자열에 추가
      if (filters.ind_cd) queryParams.append('ind_cd', filters.ind_cd);
      if (filters.loc_cd) queryParams.append('loc_cd', filters.loc_cd);
      if (filters.edu_lv) queryParams.append('edu_lv', filters.edu_lv);
      if (filters.job_cd) queryParams.append('job_cd', filters.job_cd);

      // uuid가 있다면 쿼리 매개변수에 포함시키기
      if (uuid) {
        queryParams.append('uuid', uuid);
      }

      const response = await secureApiRequest(`/jobposting/search?${queryParams}`, {
        method: "GET",
      });

      if (response.data) {
        navigate("/jobPosting/search", {
          state: { jobPosting: response.data.jobPosting, filters },
        });
      }
    } catch (error) {
      console.error("채용공고 검색 중 오류가 발생했습니다:", error);
      setError("채용공고 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>채용공고 검색</h2>
        <div className={styles.filters}>
          <select name="ind_cd" value={filters.ind_cd} onChange={handleInputChange} className={styles.select}>
            <option value="">산업/업종 선택</option>
            {["서비스업", "제조·화학", "IT·웹·통신", "은행·금융업", "미디어·디자인", "교육업", "의료·제약·복지", "판매·유통", "건설업", "기관·협회"]
              .map((industry, index) => (
                <option key={index} value={index + 1}>
                  {industry}
                </option>
              ))}
          </select>
          <select
            name="loc_cd"
            value={filters.loc_cd}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">지역 선택</option>
            {["전체", "서울", "경기", "광주", "대구", "대전", "부산", "울산", "인천", "강원", "경남", "경북", "전남", "전북", "충북", "충남", "제주", "세종"]
              .map((location, index) => (
                <option key={index} value={index + 1}>
                  {location}
                </option>
              ))}
          </select>
          <select
            name="edu_lv"
            value={filters.edu_lv}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">학력 선택</option>
            {["학력무관", "고졸이상", "대졸(2,3년)이상", "대졸(4년)이상", "석사이상", "박사이상"]
              .map((education, index) => (
                <option key={index} value={index}>
                  {education}
                </option>
              ))}
          </select>
          <select
            name="job_cd"
            value={filters.job_cd}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">직무 선택</option>
            {["기획·전략", "마케팅·홍보·조사", "회계·세무·재무", "인사·노무·HRD", "총무·법무·사무", "IT개발·데이터", "기획·전략", "영업·판매·무역"]
              .map((job, index) => (
                <option key={index} value={index}>
                  {job}
                </option>
              ))}
          </select>
          <button onClick={handleSearch} className={styles.searchButton} disabled={loading}>
            {loading ? "검색 중..." : "검색"}
          </button>
          <button onClick={resetFilters} className={styles.resetButton}>
            초기화
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

export default JobPostingSearch;