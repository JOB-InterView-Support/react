import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./QnaUpdate.module.css";
import axios from "axios";

const QnaUpdate = () => {
    const { qno } = useParams(); // URL에서 qno 추출
    const { secureApiRequest } = useContext(AuthContext); // 인증 정보
    const navigate = useNavigate();

    const [title, setTitle] = useState(""); // 제목
    const [content, setContent] = useState(""); // 내용
    const [isSecret, setIsSecret] = useState(false); // 비밀 여부
    const [file, setFile] = useState(null); // 새로 업로드할 파일
    const [preview, setPreview] = useState(null); // 새 파일 미리보기
    const [existingFile, setExistingFile] = useState(null); // 기존 첨부파일 정보
    const [isFileDeleted, setIsFileDeleted] = useState(false); // 기존 파일 삭제 여부

    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                const response = await secureApiRequest(`/qna/detail/${qno}`, { method: "GET" });
                const qna = response.data.qna;

                setTitle(qna.qtitle); // 제목 설정
                setContent(qna.qcontent); // 내용 설정
                setIsSecret(qna.qisSecret === "Y"); // 비밀 여부 설정

                if (qna.qattachmentTitle) {
                    const fileUrl = `/qna/attachments/${qna.qattachmentTitle}`;
                    setExistingFile(fileUrl); // 기존 파일 URL 설정
                }
            } catch (err) {
                console.error("QnA 상세 조회 실패:", err);
                alert("데이터를 불러오는 데 실패했습니다.");
            }
        };

        fetchQnaDetail();
    }, [qno, secureApiRequest]);

    const handleFileChange = (selectedFile) => {
        setFile(selectedFile); // 새 파일 상태 저장

        if (selectedFile && selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result); // 새 파일 미리보기 설정
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }

        // 새 파일 선택 시 기존 파일 제거
        setExistingFile(null);
        setIsFileDeleted(false);
    };

    const handleFileDelete = () => {
        setIsFileDeleted(true); // 기존 파일 삭제 표시
        setExistingFile(null); // 기존 파일 제거
        setFile(null); // 새 파일 초기화
        setPreview(null); // 미리보기 제거
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("qTitle", title);
        formData.append("qContent", content);
        formData.append("qIsSecret", isSecret ? "Y" : "N");

        if (file) {
            formData.append("file", file); // 새 파일 업로드
        } else if (isFileDeleted) {
            formData.append("deleteFile", "true"); // 기존 파일 삭제 표시
        }

        try {
            await axios.put(`http://localhost:8080/qna/update/${qno}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    refreshToken: `Bearer ${localStorage.getItem("refreshToken")}`,
                },
            });
            alert("질문이 성공적으로 수정되었습니다.");
            navigate(`/qna/detail/${qno}`);
        } catch (err) {
            console.error("QnA 수정 실패:", err);
            alert("수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <h1>Q&A 수정</h1>
            <div className={styles.formGroup}>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.titleInput}
                />
            </div>
            <div className={styles.formGroup}>
                <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={styles.textarea}
                ></textarea>
            </div>

            {/* 기존 파일 미리보기 */}
            {existingFile && !isFileDeleted && (
                <div className={styles.previewContainer}>
                    <p>기존 첨부파일:</p>
                    <img
                        src={`http://localhost:8080${existingFile}`}
                        alt="기존 첨부 이미지"
                        className={styles.previewImage}
                        style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                    />
                    <button onClick={handleFileDelete} className={styles.deleteButton}>
                        첨부파일 삭제
                    </button>
                </div>
            )}

            {/* 새 파일 미리보기 */}
            {preview && (
                <div className={styles.previewContainer}>
                    <p>새 첨부파일 미리보기:</p>
                    <img
                        src={preview}
                        alt="새 첨부 이미지 미리보기"
                        className={styles.previewImage}
                        style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                    />
                </div>
            )}

            <div className={styles.formGroup}>
                <label>새 첨부 파일:</label>
                <input type="file" onChange={(e) => handleFileChange(e.target.files[0])} />
            </div>

            <div className={styles.formGroup}>
                <label>
                    <input
                        type="checkbox"
                        checked={isSecret}
                        onChange={() => setIsSecret((prev) => !prev)}
                    />
                    비밀글로 설정
                </label>
            </div>
            <div className={styles.buttonGroup}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    이전으로
                </button>
                <button onClick={handleSubmit} className={styles.submitButton}>
                    수정 완료
                </button>
            </div>
        </div>
    );
};

export default QnaUpdate;
