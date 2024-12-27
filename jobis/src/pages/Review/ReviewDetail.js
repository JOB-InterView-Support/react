import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./ReviewDetail.module.css";

function ReviewDetail() {
    const { isLoggedIn, secureApiRequest, userid } = useContext(AuthContext);
    const { rno } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);

    // 리뷰 상세 데이터 가져오기
    const fetchReviewDetail = async () => {
        try {
            const response = await secureApiRequest(`/review/detail/${rno}`, {
                method: "GET",
            });
            console.log("서버 응답 데이터:", response.data);
            setReview(response.data); // 데이터 상태에 저장
        } catch (error) {
            setError("리뷰 데이터를 가져오는 데 실패했습니다.");
            console.error("Error fetching review details: ", error);
        }
    };

    useEffect(() => {
        fetchReviewDetail();
    }, [rno]);

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
            <h1 className={styles.reviewtitle}>{review.rtitle || "제목 없음"}</h1>
            <div className={styles.reviewInfo}>
                <p>작성자: {review.rwriter || "익명"}</p>
                <p>작성일: {review.rwdate || "작성일 없음"}</p>
                <p>조회수: {review.rcount || 0}</p>
            </div>
            <div className={styles.reviewcontent}>
                {review.rcontent || "내용 없음"}
            </div>

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
                            href={`/attachments/${review.rAttachmentTitle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {review.rAttachmentTitle}
                        </a>
                    )}
                </div>
            )}

            {isLoggedIn && userid === review.rWriter && (
                <div className={styles.buttonContainer}>
                    <button onClick={() => navigate(`/review/update/${rno}`)} className={styles.editButton}>
                        수정
                    </button>
                    <button
                        onClick={async () => {
                            if (window.confirm("정말 삭제하시겠습니까?")) {
                                try {
                                    await secureApiRequest(`/review/delete/${rno}`, {
                                        method: "DELETE",
                                    });
                                    alert("삭제가 완료되었습니다.");
                                    navigate("/review");
                                } catch (err) {
                                    alert("삭제 실패!");
                                    console.error("Error deleting review:", err);
                                }
                            }
                        }}
                        className={styles.deleteButton}
                    >
                        삭제
                    </button>
                </div>
            )}

            <button onClick={() => navigate(-1)} className={styles.backButton}>
                뒤로가기
            </button>
        </div>
    );
}

export default ReviewDetail;
