import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // 인증 컨텍스트
import styles from "./JobPostingSearch.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

// 필터 옵션 데이터 (이미 제공된 필터 옵션 데이터 그대로 사용)
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
  const { secureApiRequest } = useContext();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    job_mid_cd: "",
    loc_mcd: "",
    edu_lv: "",
    job_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const uuid = localStorage.getItem("uuid");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!uuid) {
        setError("사용자 인증 정보가 누락되었습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      const queryParams = Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      // secureApiRequest를 사용하여 요청 보내기
      const response = await secureApiRequest(`/jobposting/search?${queryParams}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: `Bearer ${refreshToken}`,
          "X-User-UUID": uuid,
        },
      });

      if (response?.data?.jobs?.job?.length) {
        navigate("/jobPosting/search", {
          state: { jobPostings: response.data.jobs.job, filters },
        });
      } else {
        setError("검색 결과가 없습니다.");
      }
    } catch (err) {
      console.error("검색 중 오류:", err);
      setError("검색 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      job_mid_cd: "",
      loc_mcd: "",
      edu_lv: "",
      job_type: "",
    });
  };

  const isSearchDisabled = Object.values(filters).every((value) => !value);

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>채용공고 검색</h2>
        <div className={styles.filters}>
          {Object.keys(filters).map((key) => (
            <select
              key={key}
              name={key}
              value={filters[key]}
              onChange={handleInputChange}
              className={styles.select}
            >
              {filterOptions[key].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
          <button
            onClick={handleSearch}
            className={styles.searchButton}
            disabled={loading || isSearchDisabled}
          >
            {loading ? "검색 중..." : "검색"}
          </button>
          <button onClick={resetFilters} className={styles.resetButton}>
            초기화
          </button>
        </div>
        {error && <div className={styles.error}>⚠️ {error}</div>}
      </div>
    </div>
  );
};

export default JobPostingSearch;
