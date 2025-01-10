import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./JobPostingSearch.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

// 필터 옵션 데이터
const filterOptions = {
  job_mid_cd: [
    { value: "", label: "직무 선택" },
    { value: "16", label: "기획·전략" },
    { value: "14", label: "마케팅·홍보" },
    { value: "3", label: "회계·세무·재무" },
    { value: "5", label: "인사·노무·HRD" },
    { value: "4", label: "총무·법무·사무" },
    { value: "2", label: "IT개발·데이터" },
    { value: "15", label: "디자인" },
    { value: "8", label: "영업·판매·무역" },
    { value: "21", label: "고객상담·TM" },
    { value: "18", label: "구매·자재·물류" },
    { value: "12", label: "상품기획·MD" },
    { value: "7", label: "운전·운송·배송" },
    { value: "10", label: "서비스" },
    { value: "11", label: "생산" },
    { value: "22", label: "건설·건축" },
    { value: "6", label: "의료" },
    { value: "9", label: "연구·R&D" },
    { value: "19", label: "교육" },
    { value: "13", label: "미디어·문화·스포츠" },
    { value: "17", label: "금융·보험" },
    { value: "20", label: "공공·복지" },
],
  loc_mcd: [
    { value: "", label: "지역 선택" },
    { value: "117000", label: "전국" },
    { value: "101000", label: "서울" },
    { value: "102000", label: "경기" },
    { value: "103000", label: "광주" },
    { value: "104000", label: "대구" },
    { value: "105000", label: "대전" },
    { value: "106000", label: "부산" },
    { value: "107000", label: "울산" },
    { value: "108000", label: "인천" },
    { value: "109000", label: "강원" },
    { value: "110000", label: "경남" },
    { value: "111000", label: "경북" },
    { value: "112000", label: "전남" },
    { value: "113000", label: "전북" },
    { value: "114000", label: "충북" },
    { value: "115000", label: "충남" },
    { value: "116000", label: "제주" },
    { value: "118000", label: "세종" },
],
  edu_lv: [
    { value: "", label: "학력 선택" },
    { value: "0", label: "학력무관" },
    { value: "1", label: "고등학교졸업" },
    { value: "2", label: "대학졸업(2,3년)" },
    { value: "3", label: "대학교졸업(4년)" },
    { value: "4", label: "석사졸업" },
    { value: "5", label: "박사졸업" },
    { value: "6", label: "고등학교졸업이상" },
    { value: "7", label: "대학졸업(2,3년)이상" },
    { value: "8", label: "대학교졸업(4년)이상" },
    { value: "9", label: "석사졸업이상" },
],
  job_type: [
    { value: "", label: "근무형태 선택" },
    { value: "1", label: "정규직" },
    { value: "2", label: "계약직" },
    { value: "4", label: "인턴직" },
    { value: "5", label: "아르바이트" },
    { value: "10", label: "계약직 (정규직 전환가능)" },
    { value: "11", label: "인턴직 (정규직 전환가능)" },
    { value: "16", label: "기간제" },
],
};

const JobPostingSearch = () => {
  const { secureApiRequest, uuid } = useContext(AuthContext); // uuid 가져오기
  const initialFilters = {
    job_mid_cd: "",
    loc_mcd: "",
    edu_lv: "",
    job_type: "",
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
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      if (uuid) {
        queryParams.append("uuid", uuid);
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
        <div className={styles.table}>
          <h2>채용공고 검색</h2>
          <div className={styles.filters}>
            {Object.entries(filterOptions).map(([key, options]) => (
              <select
                key={key}
                name={key}
                value={filters[key]}
                onChange={handleInputChange}
                className={styles.select}
              >
                {options.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            ))}
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
    </div>
  );
};

export default JobPostingSearch;
