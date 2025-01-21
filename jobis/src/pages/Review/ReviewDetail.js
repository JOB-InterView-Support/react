import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./ReviewDetail.module.css";
import DeleteModal from "../../components/common/DeleteModal";
import downloadIcon from "../../assets/images/download_icon.png";

function ReviewDetail() {
    const accessToken = localStorage.getItem("accessToken");

    const { rno } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [filePreview, setFilePreview] = useState(null); // 파일 미리보기 URL
    const { isLoggedIn, userid, username, role, secureApiRequest } =
        useContext(AuthContext);
    const handleDelete = async () => {
        try {
            await secureApiRequest(`/review/${rno}/delete`, {
                method: "PUT",
            });
            alert("리뷰가 삭제되었습니다.");
            navigate("/review"); // 삭제 후 리뷰 목록으로 이동
        } catch (error) {
            console.error("리뷰 삭제 중 에러 발생:", error);
            alert("리뷰 삭제에 실패했습니다.");
        }
    };
    
    const handleBack = () => {
        navigate("/review");
    };

    const isImageFile = (filePath) => {
        if (!filePath) return false;
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
        const extension = filePath.split(".").pop().toLowerCase();
        return imageExtensions.includes(extension);
    };

    const fetchReviewDetail = useCallback(async () => {
        try {
            const response = await secureApiRequest(`/review/detail/${rno}`, {
                method: "GET",
            });
            const data = response.data || {};
            if (data.reviewPath && data.reviewPath.startsWith("http://localhost:8080/review/attachments/")) {
                data.reviewPath = data.reviewPath.replace("http://localhost:8080/review/attachments/", "");
            }
            setReview(data);

            if (data.reviewPath) {
                const previewUrl = await fetchImage(`http://localhost:8080/review/attachments/${data.reviewPath}`);
                setFilePreview(previewUrl);
            }
        } catch (error) {
            setError("리뷰 데이터를 가져오는 데 실패했습니다.");
            console.error("Error fetching review details:", error);
        }
    }, [rno, secureApiRequest]);

    const fetchImage = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("이미지 로드 실패");
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("이미지 로드 오류:", error);
            return "/default-image.png"; // 대체 이미지 설정
        }
    };

    const handleDownload = async () => {
        if (!review || !review.reviewPath) {
            alert("다운로드할 파일이 없습니다.");
            return;
        }
        try {
            const fileUrl = `http://localhost:8080/review/attachments/${review.reviewPath}`;
            const response = await fetch(fileUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) throw new Error("파일 다운로드 실패");

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = review.reviewPath.split("/").pop(); // 파일 이름 추출
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("다운로드 오류:", error);
            alert("파일 다운로드에 실패했습니다.");
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
          fetchReviewDetail(); // 로그인된 상태에서 데이터 요청
        } else {
          setError("로그인이 필요합니다.");
        }
      }, [rno, isLoggedIn]);

    useEffect(() => {
        fetchReviewDetail();
    }, [fetchReviewDetail]);

    if (!review && !error) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.reviewDetailContainer}>
            {/* 삭제 모달 */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    setDeleteModalOpen(false);
                    handleDelete();
                }}
            />

            {/* 리뷰 제목 */}
            <h1 className={styles.reviewtitle}>{review.rtitle || "제목 없음"}</h1>
            <div className={styles.reviewInfo}>
                <p>작성자: {review.rwriter || "알 수 없음"}</p>
                <p>작성일: {review.rwdate || "작성일 없음"}</p>
                <p>조회수: {review.rcount || 0}</p>
            </div>
            <div className={styles.reviewcontent}>{review.rcontent || "내용 없음"}</div>

            {/* 첨부 파일 처리 */}
            {review.reviewPath && (
                <div className={styles.fileContainer}>
                    
                    {/* 미리보기 및 다운로드 */}
                    <a href={`http://localhost:8080/review/attachments/${review.reviewPath}`}
                        target="_blank" // 새 탭에서 열기
                        rel="noopener noreferrer"
                        className={styles.previewLink}
                    >첨부파일 미리보기</a>
                    
                </div>
            )}

            {filePreview && isImageFile(review.reviewPath) && (
                <div className={styles.reviewImageContainer}>
                    <img
                        src={filePreview}
                        alt="미리보기"
                        className={styles.reviewImage}
                    />
                    
                    <button
                        onClick={handleDownload}
                        className={styles.downloadButton}
                    >
                        <img
                    src={downloadIcon}
                    alt="Download Icon"
                    className={styles.downloadIcon}
                />
                        첨부파일 다운로드
                    </button>
                </div>
            )}

            {/* 수정 및 삭제 버튼 */}
<div className={styles.buttonGroup}>
  {(isLoggedIn && (username === review.rwriter || role === "ADMIN")) && (
    <>
      <button
        onClick={() => navigate(`/review/update/${rno}`)}
        className={styles.editButton}
      >
        수정
      </button>
      <button
        onClick={() => setDeleteModalOpen(true)}
        className={styles.deleteButton}
      >
        삭제
      </button>
    </>
  )}
</div>


            {/* 뒤로가기 버튼 */}
            <button onClick={handleBack} className={styles.backButton}>
                뒤로가기
            </button>
        </div>
    );
    
}

export default ReviewDetail;
