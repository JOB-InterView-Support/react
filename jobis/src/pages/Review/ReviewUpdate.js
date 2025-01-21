import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./ReviewUpdate.module.css";
import axios from "axios";

const ReviewUpdate = () => {
    const { rno } = useParams(); // URL에서 rno 추출
    const { secureApiRequest } = useContext(AuthContext); // 인증 정보
    const navigate = useNavigate();

    // 상태 변수
    const [reviewTitle, setReviewTitle] = useState(""); // 제목
    const [reviewContent, setReviewContent] = useState(""); // 내용
    const [file, setFile] = useState(null); // 새로 업로드할 파일
    const [existingFile, setExistingFile] = useState(null); // 기존 첨부파일 경로
    const [isFileDeleted, setIsFileDeleted] = useState(false); // 기존 파일 삭제 여부

    // 리뷰 상세 데이터 가져오기
    const fetchReviewDetail = async () => {
        try {
            const response = await secureApiRequest(`/review/detail/${rno}`, { method: "GET" });
            const review = response.data;

            // 상태 업데이트
            setReviewTitle(review.rtitle || ""); // 제목
            setReviewContent(review.rcontent || ""); // 내용
            if (review.reviewPath) {
                setExistingFile(`http://localhost:8080/${review.reviewPath}`); // 기존 첨부파일 경로
            }
        } catch (err) {
            console.error("리뷰 상세 조회 실패:", err);
            alert("데이터를 불러오는 데 실패했습니다.");
        }
    };

    // 컴포넌트 초기화
    useEffect(() => {
        fetchReviewDetail();
    }, []);

    // 첨부파일 변경 핸들러
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile); // 새 파일 상태 저장
        setExistingFile(null); // 기존 파일 제거
        setIsFileDeleted(false); // 기존 파일 삭제 여부 초기화
    };

    // 첨부파일 삭제 핸들러
    const handleFileDelete = () => {
        setIsFileDeleted(true); // 기존 파일 삭제 상태 설정
        setExistingFile(null); // 기존 파일 제거
        setFile(null); // 새 파일 초기화
    };

    // 수정 요청 핸들러
    const handleSubmit = async () => {
        if (!reviewTitle || !reviewContent) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("rTitle", reviewTitle); // 제목
        formData.append("rContent", reviewContent); // 내용

        if (file) {
            formData.append("file", file); // 새 파일 추가
        } else if (isFileDeleted) {
            formData.append("deleteFile", "true"); // 기존 파일 삭제 플래그 추가
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/review/update/${rno}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        refreshToken: `Bearer ${localStorage.getItem("refreshToken")}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("리뷰가 성공적으로 수정되었습니다.");
                navigate(`/review/detail/${rno}`);
            } else {
                console.error("서버 응답 오류:", response);
                alert("수정에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (err) {
            console.error("리뷰 수정 요청 실패:", err);
            alert("수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Review 수정</h2>
            <div className={styles.formGroup}>
                <label>제목:</label>
                <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className={styles.titleInput}
                />
            </div>

            <div className={styles.formGroup}>
                <label>내용:</label>
                <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className={styles.textarea}
                ></textarea>
            </div>

            {existingFile && !isFileDeleted && (
                <div className={styles.fileContainer}>
                    <p>기존 첨부파일:</p>
                    <a href={existingFile} download>
                        {existingFile}
                    </a>
                    <button onClick={handleFileDelete} className={styles.deleteButton}>
                        첨부파일 삭제
                    </button>
                </div>
            )}

            <div className={styles.formGroup}>
                <label>새 첨부파일:</label>
                <input type="file" onChange={handleFileChange} />
            </div>

            <div className={styles.buttonGroup}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    취소
                </button>
                <button onClick={handleSubmit} className={styles.submitButton}>
                    수정 완료
                </button>
            </div>
        </div>
    );
};

export default ReviewUpdate;
