import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./JobPostingList.module.css";
import Paging from "../../components/common/Paging";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";
import FavoriteStar from "./FavoriteStar"; // Import the FavoriteStar component

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const uuid = localStorage.getItem('uuid');  // 로컬스토리지에서 uuid 가져옴
 
  useEffect(() => {
    const fetchJobPostings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await secureApiRequest(
          `/jobposting/search?start=${currentPage - 1}&count=${itemsPerPage}`,
          { method: 'GET' }
        );
        if (response?.data?.jobs?.job) {
          setJobPostings(response.data.jobs.job);
          setTotalItems(response.data.totalItems);
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
      setLoading(true);
      setError(null);

      try {
          const favoritesResponse = await secureApiRequest(
              `/favorites/search?uuid=${uuid}`,
              { method: "GET" }
          );

          if (!favoritesResponse?.data) {
              setFavorites([]);
              return;
          }

          const favoritesWithDetails = await Promise.all(
              favoritesResponse.data.map(async (favorite) => {
                  // 채용공고 상세 정보를 사람인 API에서 조회
                  const jobResponse = await secureApiRequest(
                      `/jobposting/${favorite.jobPostingId}`,
                      { method: "GET" }
                  );

                  // 채용공고의 데이터가 없으면 기본값을 사용
                  const jobData = jobResponse?.data?.jobs?.job || {};

                  return {
                      ...favorite,
                      jobTitle: jobData?.position?.title || "정보 없음", // 제목
                      industry: jobData?.position?.industry?.name || "정보 없음", // 업종
                      location: jobData?.position?.location?.name.replace(/&gt;/g, '>') || "정보 없음", // 위치
                      salary: jobData?.salary?.name || "정보 없음", // 연봉
                      company: jobData?.company?.detail?.name || "정보 없음", // 회사명
                  };
              })
          );

          setFavorites(favoritesWithDetails);
      } catch (err) {
          setError("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
          setLoading(false);
      }
  };

  if (uuid) {
      fetchFavorites();
  } else {
      setLoading(false);
  }
}, [uuid, secureApiRequest]);

  const toggleFavorite = async (jobPostingId, newFavoritedState) => {
    try {
      if (newFavoritedState) {
        const favoriteData = {
          jobFavoritesNo: crypto.randomUUID(),
          uuid: uuid,
          jobPostingId: jobPostingId,
          jobCreatedDate: new Date().toISOString()
        };

        const response = await secureApiRequest(`/favorites`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(favoriteData)
        });
        console.log('즐겨찾기 추가 응답:', response);
        
        if (response?.data) {
          setFavorites([...favorites, response.data]);
        }
      } else {
        await secureApiRequest(
          `/favorites/delete?uuid=${uuid}&jobPostingId=${jobPostingId}`,
          { method: "DELETE" }
        );
        setFavorites(favorites.filter(fav => fav.jobPostingId !== jobPostingId));
      }
    } catch (err) {
      console.error("즐겨찾기 상태 변경 중 오류 발생:", err);
    }
  };

  const handleJobClick = (id) => navigate(`/jobPosting/${id}`);

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
          <Paging
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  </div>
  );
};

export default JobPostingList;
