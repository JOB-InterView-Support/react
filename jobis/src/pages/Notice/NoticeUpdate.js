import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./NoticeUpdate.module.css";
import axios from "axios";

function NoticeUpdate() {
    const { secureApiRequest } = useContext(AuthContext);
    const { no } = useParams();
    const navigate = useNavigate();
    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeContent, setNoticeContent] = useState("");
    const [noticeFile, setNoticeFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // 파일 미리보기 URL
    const [originalNoticePath, setOriginalNoticePath] = useState(null); // 기존 파일 경로

    // 뒤로가기 버튼 핸들러
    const handleBack = () => {
        navigate(-1);
    };

    const isImageFile = (filePath) => {
        if (!filePath) return false; // null 또는 undefined 방지
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
        const extension = filePath.split(".").pop().toLowerCase();
        return imageExtensions.includes(extension);
    };

    // 공지사항 상세 데이터 가져오기
// 공지사항 상세 데이터 가져오기
const handleNoticeDetail = async () => {
    try {
        const response = await secureApiRequest(`/notice/detail/${no}`, {
            method: "GET",
        });

        console.log("API 응답 데이터:", response.data); // API 응답 데이터 확인
        const { noticeTitle, noticeContent, noticePath } = response.data;

        setNoticeTitle(noticeTitle || "");
        setNoticeContent(noticeContent || "");

        // noticePath가 절대 경로인지 확인 후 처리
        if (noticePath) {
            const isAbsolutePath = noticePath.startsWith("http://") || noticePath.startsWith("https://");
            const fullPath = isAbsolutePath ? noticePath : `http://localhost:8080/attachments/${noticePath}`;
            console.log("파일 경로:", fullPath); // 경로 확인
            setFilePreview(fullPath); // 미리보기 URL 설정
            setOriginalNoticePath(fullPath); // 원본 파일 경로 설정
        } else {
            setFilePreview(null); // 파일이 없는 경우
            setOriginalNoticePath(null);
        }
    } catch (error) {
        console.error("공지사항 데이터를 불러오지 못했습니다:", error);
    }
};

    
    

    // 파일 변경 핸들러
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setNoticeFile(selectedFile);
    
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setFilePreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(originalNoticePath); // 기존 파일 미리보기 유지
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

    useEffect(() => {
        handleNoticeDetail();
    }, []);

    return (
        <div className={styles.noticecontainer}>
            <h2 className={styles.noticetitle}>
                <input
                    type="text"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className={styles.noticenewtitle}
                />
            </h2>

            <div className={styles.noticeinfo}>
                <span>수정일: {new Date().toLocaleDateString()}</span>
            </div>

            <div className={styles.noticecontent}>
                <textarea
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className={styles.textarea}
                ></textarea>
            </div>

            <div className={styles.fileInput}>
                <input type="file" onChange={handleFileChange} />
                {filePreview ? (
                    isImageFile(filePreview) ? (
                        <img
                            src={filePreview}
                            alt="첨부파일 미리보기"
                            className={styles.previewImage}
                            onError={() => console.error("이미지 로드 실패:", filePreview)} // 이미지 로드 실패 확인
                        />
                    ) : (
                        <a href={originalNoticePath} download>
                            기존 파일 미리보기
                        </a>
                    )
                ) : (
                    <span>첨부파일 없음</span>
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
