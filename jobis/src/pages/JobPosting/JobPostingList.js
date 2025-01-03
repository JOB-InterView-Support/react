import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JobPostingList.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";
import FavoriteStar from "./FavoriteStar";
import { AuthContext } from "../../AuthProvider";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]); // 채용공고 목록 상태
  const [favorites, setFavorites] = useState([]); // 즐겨찾기 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalItems, setTotalItems] = useState(5); // 전체 항목 개수
  const [totalPages, setTotalPages] = useState(3); // 전체 페이지 수
  const itemsPerPage = 10; // 한 페이지에 보여줄 항목 수
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const [uuid, setUuid] = useState(null); // uuid 상태

  // localStorage에서 uuid를 가져오는 useEffect
  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    if (storedUuid) {
      setUuid(storedUuid); // uuid 상태 업데이트
    }
  }, []);

  // 채용공고 목록 가져오기
  useEffect(() => {
    const fetchJobPostings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await secureApiRequest(
          `/jobposting/search?page=${currentPage}&size=${itemsPerPage}`,
          { method: 'GET' }
        );
        if (response?.data?.jobs?.job) {
          const sortedJobPostings = response.data.jobs.job.sort((a, b) => {
            const dateA = new Date(a.position?.createdDate);
            const dateB = new Date(b.position?.createdDate);
            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;

            const titleA = a.position?.title.toLowerCase() || "";
            const titleB = b.position?.title.toLowerCase() || "";
            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
            return 0;
          });

          setJobPostings(sortedJobPostings); // 정렬된 채용공고 리스트
          setTotalItems(response.data.jobs.total); // 전체 항목 수
          setTotalPages(Math.ceil(response.data.jobs.total / itemsPerPage)); // 전체 페이지 수 계산
        } else {
          setError('채용공고 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('채용공고를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (uuid) {
        try {
          const response = await secureApiRequest(`/favorites/search?uuid=${uuid}`, { method: 'GET' });
          setFavorites(response?.data || []);
        } catch (err) {
          console.error('즐겨찾기 데이터를 가져오는 중 오류 발생:', err);
        }
      }
    };

    fetchJobPostings();
    fetchFavorites();
  }, [currentPage, uuid]);

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

        if (response?.data) {
          setFavorites(prevFavorites => [...prevFavorites, response.data]);
        }
      } else {
        await secureApiRequest(`/favorites/delete?uuid=${uuid}&jobPostingId=${jobPostingId}`, { method: "DELETE" });
        setFavorites(favorites.filter((fav) => fav.jobPostingId !== jobPostingId));
      }
    } catch (err) {
      console.error("즐겨찾기 상태 변경 중 오류 발생:", err.response?.data || err.message);
    }
  };

  const handleJobClick = (id) => navigate(`/jobPosting/${id}`);

  const pageButtons = () => {
    const pageArr = [];
    let startPage = Math.max(1, currentPage - 2); // 현재 페이지 기준으로 2개 앞
    let endPage = Math.min(totalPages, currentPage + 2); // 현재 페이지 기준으로 2개 뒤

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

  if (loading) return <p>채용공고 목록을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <JobPostingSubMenubar />
      <div className={styles.container}>
        <h2>채용공고 목록</h2>
        <div className={styles.jobList}>
          {jobPostings.length > 0 ? (
            jobPostings.map((job) => (
              <div
                key={job.id}
                className={styles.jobCard}
                onClick={() => handleJobClick(job.id)}
              >
                <h3>{job.position?.title || "제목 없음"}</h3>
                <p>업종: {job.position?.industry?.name || "정보 없음"}</p>
                <p>위치: {job.position?.location?.name || "정보 없음"}</p>
                <p>연봉: {job.salary?.name || "정보 없음"}</p>
                <div className={styles.favoriteIcon}>
                  <FavoriteStar
                    initialFavorited={favorites.some(fav => fav.jobPostingId === job.id)} 
                    onToggle={(newFavoritedState) => toggleFavorite(job.id, newFavoritedState)} 
                    jobPostingId={job.id}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>검색된 채용공고가 없습니다.</p>
          )}
        </div>

        {totalItems > 0 && (
          <div className={styles.pagingContainer}>
            {pageButtons().map((page) => (
              <button
                key={page}
                className={page === currentPage ? styles.active : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostingList;

