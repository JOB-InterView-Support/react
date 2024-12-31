import React, { useEffect, useState, useContext, useCallback } from "react"; // useCallback 추가
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./ReviewDetail.module.css";
import DeleteModal from "../../components/common/DeleteModal";

function ReviewDetail() {
    const { isLoggedIn, userid,secureApiRequest } = useContext(AuthContext);
    const { rno } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // 리뷰 상세 데이터 가져오기
    const fetchReviewDetail = useCallback(async () => {
        try {
            const response = await secureApiRequest(`/review/detail/${rno}`, {
                method: "GET",
            });
            console.log("서버 응답 데이터:", response.data);
            setReview(response.data);
        } catch (error) {
            setError("리뷰 데이터를 가져오는 데 실패했습니다.");
            console.error("Error fetching review details:", error);
        }
    }, [rno, secureApiRequest]); // 의존성 배열에 rno와 secureApiRequest 추가

    useEffect(() => {
        fetchReviewDetail();
    }, [fetchReviewDetail]); // fetchReviewDetail을 의존성 배열에 포함

    // 리뷰 삭제 처리 함수
    const handleDelete = async () => {
        try {
            await secureApiRequest(`/review/${rno}/delete`, {
                method: "PUT",
            });
            alert("리뷰가 삭제되었습니다.");
            navigate("/review");
        } catch (error) {
            console.error("리뷰 삭제 중 에러 발생:", error);
            alert("리뷰 삭제에 실패했습니다.");
        }
    };

    // 로딩 상태 표시
    if (!review && !error) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    // 에러 상태 표시
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
                <p>작성자: {review.rwriter}</p>
                <p>작성일: {review.rwdate}</p>
                <p>조회수: {review.rcount}</p>
            </div>
            <div className={styles.reviewcontent}>{review.rcontent || "내용 없음"}</div>

            {/* 첨부 파일 처리 */}
            {review.rattachmentTitle && (
                <div className={styles.attachmentSection}>
                    <h4>첨부 파일:</h4>
                    {review.rattachmentTitle.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img
                            src={`/attachments/${review.rattachmentTitle}`}
                            alt="첨부 이미지"
                            className={styles.attachmentImage}
                        />
                    ) : (
                        <a
                            href={`/attachments/${review.rattachmentTitle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {review.rattachmentTitle}
                        </a>
                    )}
                </div>
            )}

            {/* 수정 및 삭제 버튼 */}
        
            
                <div className={styles.buttonGroup}>
                    <button onClick={() => navigate(`/review/update/${rno}`)} className={styles.editButton}>수정</button>
                    <button onClick={() => setDeleteModalOpen(true)} className={styles.deleteButton}>삭제</button>
                </div>
            

            {/* 뒤로가기 버튼 */}
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                뒤로가기
            </button>
        </div>
    );
}

export default ReviewDetail;
