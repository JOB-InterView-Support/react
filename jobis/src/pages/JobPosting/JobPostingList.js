import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./JobPostingList.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";
import FavoriteStar from "./FavoriteStar";
import { AuthContext } from "../../AuthProvider";
import Paging from "../../components/common/Paging";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const [uuid, setUuid] = useState(null);

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
    if (filteredJobPostings) {
      // 필터링된 채용공고가 있으면 이를 사용
      setJobPostings(filteredJobPostings);
      setLoading(false);
    } else {
      fetchJobPostings(currentPage);
    }
  }, [filteredJobPostings, currentPage]);

  const fetchJobPostings = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const start = (page - 1) * itemsPerPage + 1;
      const response = await secureApiRequest(
        `/jobposting/search?start=${start}&count=${itemsPerPage}`,
        { method: "GET" }
      );

      console.log("Job Posting API Response:", response?.data);

      if (response?.data) {
        const { jobs } = response.data;
        setJobPostings(jobs.job || []);
        setTotalPages(Math.ceil(jobs.count / itemsPerPage));  // 전체 페이지 수 설정
      } else {
        setError("채용공고를 찾을 수 없습니다.");
      }
    } catch (err) {
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
      console.error("Error fetching job postings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [uuid]);

  const fetchFavorites = async () => {
    if (uuid) {
      try {
        const response = await secureApiRequest(
          `/favorites/search?uuid=${uuid}`,
          { method: "GET" }
        );
        setFavorites(response?.data || []);
        console.log("Favorites Data:", response?.data);
      } catch (err) {
        console.error("즐겨찾기 데이터를 가져오는 중 오류 발생:", err);
      }
    }
  };

  const toggleFavorite = async (jobPostingId, newFavoritedState) => {
    try {
      if (newFavoritedState) {
        const favoriteData = {
          jobFavoritesNo: crypto.randomUUID(),
          uuid: uuid,
          jobPostingId: jobPostingId,
          jobCreatedDate: new Date().toISOString(),
        };

        const response = await secureApiRequest(`/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(favoriteData),
        });

        console.log("Favorite Added:", response?.data);

        if (response?.data) {
          setFavorites((prevFavorites) => [...prevFavorites, response.data]);
        }
      } else {
        await secureApiRequest(
          `/favorites/delete?uuid=${uuid}&jobPostingId=${jobPostingId}`,
          { method: "DELETE" }
        );
        setFavorites(favorites.filter((fav) => fav.jobPostingId !== jobPostingId));
      }
    } catch (err) {
      console.error("즐겨찾기 상태 변경 중 오류 발생:", err.response?.data || err.message);
    }
  };

  const handleJobClick = (id) => {
    console.log(`Job clicked with ID: ${id}`);
    navigate(`/jobposting/${id}`);
  };

  const pageButtons = () => {
    const pageArr = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage > 3) {
      pageArr.push(1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageArr.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageArr.push(totalPages);
    }

    return pageArr;
  };

  // HTML 엔티티 처리 함수
  const decodeHtml = (html) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  };

  // 필터링 로직 적용
  const applyFilters = (job) => {
    if (!filters) return true;

    const { industry, location, salary, title } = filters;

    // 필터 조건에 맞는지 확인 (각 필드가 있을 경우에만)
    const matchesIndustry = industry ? job?.position?.industry?.name === industry : true;
    const matchesLocation = location ? job?.position?.location?.name === location : true;
    const matchesSalary = salary ? job?.salary?.name === salary : true;
    const matchesTitle = title ? job?.position?.title?.includes(title) : true;

    return matchesIndustry && matchesLocation && matchesSalary && matchesTitle;
  };

  if (loading) return <p>채용공고 목록을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>채용공고 목록</h2>
        <div className={styles.jobList}>
          {jobPostings.length > 0 ? (
            jobPostings
              .filter(applyFilters)  // 필터링된 데이터만 표시
              .map((job) => {
                console.log("Job Data:", job);
                return (
                  <div
                    key={job.id}
                    className={styles.jobCard}
                    onClick={() => handleJobClick(job.id)}
                  >
                    <h3>{job?.position?.title ? decodeHtml(job?.position?.title) : "제목 없음"}</h3>
                    <p>업종: {job?.position?.industry?.name ? decodeHtml(job?.position?.industry?.name) : "정보 없음"}</p>
                    <p>위치: {job?.position?.location?.name ? decodeHtml(job?.position?.location?.name) : "정보 없음"}</p>
                    <p>연봉: {job?.salary?.name ? decodeHtml(job?.salary?.name) : "정보 없음"}</p>
                    <div className={styles.favoriteIcon}>
                      <FavoriteStar
                        initialFavorited={favorites.some((fav) => fav.jobPostingId === job.id)}
                        onToggle={(newFavoritedState) => toggleFavorite(job.id, newFavoritedState)}
                        jobPostingId={job.id}
                      />
                    </div>
                  </div>
                );
              })
          ) : (
            <p className={styles.noResults}>검색된 채용공고가 없습니다.</p>
          )}
        </div>

        <div className={styles.pagination}>
          {pageButtons().map((page, index) => (
            <button
              key={index}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.active : ""
              }`}
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
