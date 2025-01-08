import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./JobPostingList.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";
import { AuthContext } from "../../AuthProvider";
import FavoriteStar from "./FavoriteStar";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { secureApiRequest, apiClient } = useContext(AuthContext);
  const [uuid, setUuid] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // useLocation을 통해 전달된 state 값 받아오기
  const location = useLocation();
  const { jobPosting: filteredJobPostings, filters } = location.state || {};

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    if (storedUuid) {
      setUuid(storedUuid);
    }
  }, []);

  useEffect(() => {
    if (!filteredJobPostings || filteredJobPostings.length === 0) {
      fetchJobPostings(currentPage);
    } else {
      setJobPostings(filteredJobPostings);
      setLoading(false);
    }
  }, [filteredJobPostings, currentPage]);

  const fetchJobPostings = async (page) => {
    if (isFetching) return; // 이미 요청 진행 중이면 종료
    setIsFetching(true);
    setLoading(true);
    setError(null);
    try {
      const start = (page - 1) * itemsPerPage + 1;
      const filterParams = [];
      if (filters?.industry) filterParams.push(`industry=${filters.industry}`);
      if (filters?.location) filterParams.push(`location=${filters.location}`);
      if (filters?.salary) filterParams.push(`salary=${filters.salary}`);
      if (filters?.title) filterParams.push(`title=${filters.title}`);

      const filterQuery = filterParams.length ? `&${filterParams.join("&")}` : "";
      const response = await secureApiRequest(
        `/jobposting/search?start=${start}&count=${itemsPerPage}${filterQuery}`,
        { method: "GET" }
      );
      if (response?.data) {
        const { jobs } = response.data;
        setJobPostings(jobs.job || []);
        setTotalPages(Math.ceil(jobs.count / itemsPerPage));
      } else {
        setError("채용공고를 찾을 수 없습니다.");
      }
    } catch (err) {
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
      console.error("Error fetching job postings:", err);
    } finally {
      setLoading(false);
      setIsFetching(false); // 플래그 초기화
    }
  };

  const handleJobClick = (id) => {
    navigate(`/jobposting/${id}`);
  };

  const pageButtons = () => {
    const pageArr = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    if (currentPage > 3) pageArr.push(1);
    for (let i = startPage; i <= endPage; i++) pageArr.push(i);
    if (currentPage < totalPages - 2) pageArr.push(totalPages);
    return pageArr;
  };

  const decodeHtml = (html) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  };

  const applyFilters = (job) => {
    if (!filters) return true;
    const { industry, location, salary, title } = filters;
    const matchesIndustry = industry ? job?.position?.industry?.name === industry : true;
    const matchesLocation = location ? job?.position?.location?.name === location : true;
    const matchesSalary = salary ? job?.salary?.name === salary : true;
    const matchesTitle = title ? job?.position?.title?.includes(title) : true;
    return matchesIndustry && matchesLocation && matchesSalary && matchesTitle;
  };

  const handleFavoriteToggle = async (jobPostingId, jobPostingNo) => {
    if (!uuid) return;  // uuid가 없으면 처리하지 않음
  
    try {
      // 현재 즐겨찾기 상태 확인 후 토글하기
      const response = await secureApiRequest(
        `/favorites/toggle?uuid=${uuid}&jobPostingId=${jobPostingId}&jobPostingNo=${jobPostingNo}`,
        { method: "POST" }
      );
  
      if (response?.data) {
        console.log("즐겨찾기 상태 변경:", response.data);
      } else {
        console.error("즐겨찾기 상태 변경 실패");
      }
    } catch (err) {
      console.error("즐겨찾기 토글 중 오류 발생:", err);
    }
  };

  if (loading) return <p>채용공고 목록을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>채용공고 목록</h2>
        <div className={styles.table}>
        <div className={styles.jobList}>
          {jobPostings.length > 0 ? (
            jobPostings
              .filter(applyFilters)
              .map((job) => (
                <div
                  key={job.id}
                  className={styles.jobCard}
                  onClick={() => handleJobClick(job.id)}
                >
                  <h3>{job?.position?.title ? decodeHtml(job?.position?.title) : "제목 없음"}</h3>
                  <p>업종: {job?.position?.industry?.name || "정보 없음"}</p>
                  <p>위치: {job?.position?.location?.name || "정보 없음"}</p>
                  <p>연봉: {job?.salary?.name || "정보 없음"}</p>
                  <div className={styles.favoriteIcon}>
                  <FavoriteStar
                    initialFavorited={false}
                    onToggle={handleFavoriteToggle} // 여기서 API 호출하는 함수 전달
                    jobPostingId={job.id}
                    uuid={uuid}
                  />
                  </div>
                </div>
              ))
          ) : (
            <p className={styles.noResults}>검색된 채용공고가 없습니다.</p>
          )}
        </div>
        </div>
        <div className={styles.pagination}>
          {pageButtons().map((page, index) => (
            <button
              key={index}
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobPostingList;
