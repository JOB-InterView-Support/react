import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./JobPostingDetail.module.css";
import JobPostingSubMenubar from "../../components/common/subMenubar/JobPostingSubMenubar";

const JobPostingDetail = () => {
  const { id } = useParams(); // 공고 ID
  const navigate = useNavigate();
  const { secureApiRequest, uuid } = useContext(AuthContext);
  const [jobDetails, setJobDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await secureApiRequest(`/jobposting/${id}`, { method: "GET" });
        setJobDetails(response?.data?.job);
        checkFavorite(id); // 즐겨찾기 여부 확인
      } catch (error) {
        console.error("채용공고 상세 조회 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, secureApiRequest]);

  const checkFavorite = async (jobPostingId) => {
    try {
      const response = await secureApiRequest(`/favorites/check?uuid=${uuid}&jobPostingId=${jobPostingId}`, {
        method: "GET",
      });
      setIsFavorite(response?.data);
    } catch (error) {
      console.error("즐겨찾기 여부 확인 중 오류:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const url = isFavorite ? `/favorites/delete` : `/favorites`;
      const method = isFavorite ? "DELETE" : "POST";
      const body = isFavorite ? null : { jobPostingId: id, uuid };

      await secureApiRequest(url, {
        method,
        body: body && JSON.stringify(body),
      });

      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("즐겨찾기 토글 중 오류:", error);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (!jobDetails) return <p>공고 정보를 불러오지 못했습니다.</p>;

  return (
    <div>
      <JobPostingSubMenubar />
        <div className={styles.container}>
          <h2>{jobDetails?.position?.title || "공고 제목 없음"}</h2>
          <button onClick={toggleFavorite} className={styles.favoriteButton}>
            {isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          </button>
          <p>회사명: {jobDetails?.company?.detail?.name || "정보 없음"}</p>
          <p>위치: {jobDetails?.position?.location?.name || "정보 없음"}</p>
          <p>급여: {jobDetails?.salary?.name || "정보 없음"}</p>
          <p>공고 링크: <a href={jobDetails?.url} target="_blank" rel="noopener noreferrer">상세보기</a></p>
          <button onClick={() => navigate(-1)}>뒤로가기</button>
        </div>
    </div>
  );
};

export default JobPostingDetail;
