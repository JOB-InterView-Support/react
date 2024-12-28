import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./JobPostingSearch.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

const JobPostingSearch = () => {
  const { secureApiRequest } = useContext(AuthContext);
  const initialFilters = {
    ind_cd: "",
    loc_cd: "",
    edu_lv: "",
    job_cd: "",
  };
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);  // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가
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
    setLoading(true);  // 검색 시작 시 로딩 상태 활성화
    setError(null); // 에러 초기화
    try {
      const queryParams = new URLSearchParams(filters).toString();
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
      setLoading(false);  // 검색 완료 후 로딩 상태 해제
    }
  };

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
            {/* 산업 옵션은 배열로 관리 */}
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
            {/* 지역 옵션 */}
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
            {/* 학력 선택 */}
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
            {/* 직무 선택 */}
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
        {error && <div className={styles.error}>{error}</div>} {/* 에러 메시지 출력 */}
      </div>
    </div>
  );
};

export default JobPostingSearch;
