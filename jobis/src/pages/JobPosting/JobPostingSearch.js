import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./JobPostingSearch.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

// 필터 옵션 데이터
const filterOptions = {
  job_cd: [
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
  const { secureApiRequest } = useContext(AuthContext);
  const initialFilters = {
    job_cd: "",
    loc_mcd: "",
    edu_lv: "",
    job_type: "",
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
      const queryParams = new URLSearchParams();

      // 필터 객체에서 빈 값이 아닌 필터만 추가
      if (filters.job_cd) queryParams.append('job_cd', filters.job_cd);
      if (filters.loc_mcd) queryParams.append('loc_cd', filters.loc_mcd);
      if (filters.edu_lv) queryParams.append('edu_lv', filters.edu_lv);
      if (filters.job_type) queryParams.append('job_type', filters.job_type);

      const response = await secureApiRequest(`/jobposting/search?${queryParams}`, {
        method: "GET",
      });

      if (response.data) {
        navigate("/jobPosting/search", {
          state: { jobPosting: response.data.jobPostings, filters },
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
          {Object.keys(filterOptions).map((filterKey) => (
            <select
              key={filterKey}
              name={filterKey}
              value={filters[filterKey]}
              onChange={handleInputChange}
              className={styles.select}
            >
              {filterOptions[filterKey].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
        {error && <div className={styles.error}>{error}</div>} {/* 에러 메시지 출력 */}
      </div>
    </div>
  );
};

export default JobPostingSearch;
