import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./NoticeUpdate.module.css";
import axios from "axios";

function NoticeUpdate() {
    const { secureApiRequest } = useContext(AuthContext);
    const { no } = useParams();
    const navigate = useNavigate();

    // State 변수
    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeContent, setNoticeContent] = useState("");
    const [filePreview, setFilePreview] = useState(null); // 파일 미리보기 URL
    const [noticeFile, setNoticeFile] = useState(null); // 새로 업로드할 파일
    const [originalNoticePath, setOriginalNoticePath] = useState(null); // 기존 파일 경로
    const [isFileDeleted, setIsFileDeleted] = useState(false); // 기존 파일 삭제 여부

    // 뒤로가기 버튼 핸들러
    const handleBack = () => {
        navigate(-1);
    };

    // 이미지 파일 여부 확인 함수
    const isImageFile = (filePath) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
        const extension = filePath?.split(".").pop().toLowerCase();
        return imageExtensions.includes(extension);
    };

    // 공지사항 상세 데이터 가져오기
    const handleNoticeDetail = async () => {
        try {
            const response = await secureApiRequest(`/notice/detail/${no}`, {
                method: "GET",
            });

            const { noticeTitle, noticeContent, noticePath } = response.data;
            setNoticeTitle(noticeTitle || "");
            setNoticeContent(noticeContent || "");

            if (noticePath) {
                const isAbsolutePath = noticePath.startsWith("http://") || noticePath.startsWith("https://");
                const fullPath = isAbsolutePath
                    ? noticePath
                    : `http://localhost:8080/attachments/${noticePath}`;
                setFilePreview(fullPath);
                setOriginalNoticePath(fullPath);
            }
        } catch (error) {
            console.error("공지사항 데이터를 불러오지 못했습니다:", error);
        }
    };

    // 파일 삭제 핸들러
    const handleFileDelete = () => {
        console.log("파일 삭제 요청 실행");
        setIsFileDeleted(true); // 기존 파일 삭제 상태로 설정
        setFilePreview(null); // 미리보기 제거
        setNoticeFile(null); // 업로드 파일 제거
    };

    // 파일 변경 핸들러
    // const handleFileChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     setNoticeFile(selectedFile);

    //     if (selectedFile && selectedFile.type.startsWith("image/")) {
    //         const reader = new FileReader();
    //         reader.onload = () => setFilePreview(reader.result);
    //         reader.readAsDataURL(selectedFile);
    //     } else {
    //         setFilePreview(null);
    //     }
    // };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setNoticeFile(selectedFile);
    
    // 파일 확장자로 이미지 여부 확인
    const isImage = selectedFile.name.match(/\.(jpg|jpeg|png|gif|bmp)$/i);
    if (isImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setFilePreview(event.target.result); // 이미지 미리보기 URL 설정
        };
        reader.readAsDataURL(selectedFile);
    } else {
        setFilePreview(null); // 이미지가 아닌 경우 미리보기 제거
        alert("이미지가 아닌 파일은 미리보기를 지원하지 않습니다.");
    }
    };
    

    // 공지사항 업데이트 핸들러
    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("noticeTitle", noticeTitle);
            formData.append("noticeContent", noticeContent);

            if (noticeFile) {
                formData.append("file", noticeFile);
            } else if (isFileDeleted) {
                formData.append("deleteFile", "true"); // 파일 삭제 플래그 추가
            }

            await axios.put(`http://localhost:8080/notice/update/${no}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    refreshToken: `Bearer ${localStorage.getItem("refreshToken")}`,
                },
            });
            alert("공지사항이 성공적으로 수정되었습니다.");
            navigate(`/notice/detail/${no}`);
        } catch (error) {
            console.error("공지사항 수정 요청 실패:", error);
            alert("공지사항 수정 요청 중 오류가 발생했습니다.");
        }
    };

    // 초기화
    useEffect(() => {
        handleNoticeDetail();
    }, []);

    return (
        <div className={styles.noticeContainer}>
            <h2 className={styles.noticeTitle}>
                <input
                    type="text"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className={styles.noticeNewTitle}
                />
            </h2>

            <div className={styles.noticeInfo}>
                <span>수정일: {new Date().toLocaleDateString()}</span>
            </div>

            <div className={styles.noticeContent}>
                <textarea
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className={styles.textarea}
                ></textarea>
            </div>

            {/* 파일 업로드 및 미리보기 */}
            <div className={styles.fileInput}>
            <input type="file" onChange={handleFileChange} />
            {filePreview ? (
                <img
                    src={filePreview}
                    alt="새 첨부파일 미리보기"
                    className={styles.previewImage}
                    onError={() => console.error("미리보기 이미지 로드 실패:", filePreview)} // 이미지 로드 실패 로그 추가
                />
            ) : (
                <span>첨부파일 없음</span>
            )}
            {filePreview && (
                <button onClick={handleFileDelete}
                    className={styles.deleteButton}>
                    첨부파일 삭제
                </button>
            )}
        </div>



            <div className={styles.buttonGroup}>
                <button onClick={handleBack} className={styles.backButton}>
                    이전으로
                </button>
                <button onClick={handleUpdate} className={styles.saveButton}>
                    저장
                </button>
            </div>
        </div>
    );
}

export default NoticeUpdate;
