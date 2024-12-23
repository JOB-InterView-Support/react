import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios"; // Axios 클라이언트
import styles from "./JobPostingSearch.module.css"; // CSS Modules
import { AuthContext } from "../../AuthProvider";
import JobPostingList from "./JobPostingList"; // JobPostingList 컴포넌트

const JobPostingSearch = () => {
  const { isLoggedIn, isAuthInitialized, secureApiRequest, role } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [jobPostingSearch, setJobPostingSearch] = useState([]); // 데이터를 저장할 상태
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 필터 초기화
  const resetFilters = () => {
    setSelectedJobType('');
    setSelectedLocation('');
    setSelectedExperience('');
    setSelectedEducation('');
  };

  // 로그인 상태 및 인증 상태 확인 후 리다이렉트 처리
  useEffect(() => {
    
    if (!isLoggedIn) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const fetchJobPostingSearch = async (page = 1) => {
    if ( !isLoggedIn) {
      return; // 로그인 상태가 아닐 때 실행하지 않음
    }

    console.log("채용공고 검색 요청 시작");
    console.log("선택한 필터 값:", {
      selectedJobType,
      selectedLocation,
      selectedExperience,
      selectedEducation,
    });
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/search", {
        params: {
          keyword: "developer",  // 키워드 예시
          jobType: selectedJobType,  // 직종
          location: selectedLocation,  // 지역
          experience: selectedExperience,  // 경력
          education: selectedEducation,  // 학력
        },
      });
      console.log("채용공고 검색 성공:", response.data);
      setJobPostingSearch(response.data);
    } catch (err) {
      console.error("채용공고 검색 오류:", err);
      setError("채용공고 검색 중 오류가 발생했습니다.");
    } finally {
      console.log("채용공고 검색 완료");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchJobPostingSearch();
    }
    return () => {
      // Cleanup 함수 추가
      console.log("컴포넌트 언마운트 중...");
      // 여기에 추가적인 cleanup 작업을 넣을 수 있습니다
    };
  }, [isLoggedIn]);

  // 인증 상태가 초기화되지 않았을 때 메시지 출력
  

  if (error) {
    return <p className={styles.error}>오류 발생: {error}</p>;
  }

  console.log("검색결과:", jobPostingSearch);

  return (
    <div className={styles.searchContainer}>
      <h2>채용공고 검색</h2>

      {/* 선택한 필터 옵션들 표시 */}
      <div className={styles.selectedFilters}>
        <p><strong>직종:</strong> {selectedJobType || "선택 안됨"}</p>
        <p><strong>지역:</strong> {selectedLocation || "선택 안됨"}</p>
        <p><strong>경력:</strong> {selectedExperience || "선택 안됨"}</p>
        <p><strong>학력:</strong> {selectedEducation || "선택 안됨"}</p>
      </div>

      {/* 필터 옵션 */}
      <div className={styles.filters}>
        <select value={selectedJobType} onChange={(e) => setSelectedJobType(e.target.value)}>
          <option value="">직종 선택</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
        </select>

        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="">지역 선택</option>
          <option value="Seoul">서울</option>
          <option value="Busan">부산</option>
        </select>

        <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
          <option value="">경력 선택</option>
          <option value="0-3">0~3년</option>
          <option value="4-7">4~7년</option>
          <option value="8+">8년 이상</option>
        </select>

        <select value={selectedEducation} onChange={(e) => setSelectedEducation(e.target.value)}>
          <option value="">학력 선택</option>
          <option value="HighSchool">고등학교</option>
          <option value="Bachelor">대학</option>
          <option value="Master">석사 이상</option>
        </select>
      </div>

      {/* 버튼들 */}
      <div className={styles.buttons}>
        <button onClick={fetchJobPostingSearch}>검색</button>
        <button onClick={resetFilters}>초기화</button>
      </div>

      {/* 검색결과 */}
      {jobPostingSearch.length > 0 && (
        <JobPostingList postings={jobPostingSearch} />
      )}
    </div>
  );
};

export default JobPostingSearch;
