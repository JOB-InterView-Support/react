import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./NoticeUpdate.module.css";
import axios from "axios";

function NoticeUpdate() {
    const { secureApiRequest } = useContext(AuthContext);
    const { no } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // 파일 미리보기 URL

    const handleBack = () => {
        navigate(-1);
    };

    const handleNoticeDetail = async () => {
        try {
            console.log("API 호출 시작"); // API 호출 시작 로그
            const response = await secureApiRequest(`/notice/detail/${no}`, {
                method: "GET",
            });
            console.log("API 응답 데이터:", response.data); // API 응답 데이터 출력
            setNotice(response.data);

            // 이미지 경로로 파일 미리보기 URL 생성
            if (response.data && response.data.noticePath) {
                const previewUrl = await fetchImage(response.data.noticePath);
                setFilePreview(previewUrl);
                console.log("미리보기 url 생성됨", previewUrl)
            } else {
                console.error("noticePath가 null이거나 정의되지 않았습니다.");
            }
        } catch {
            console.error("공지사항 데이터를 불러오지 못했습니다."); // API 요청 실패 로그
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl); // 업로드된 파일의 미리보기 URL 설정
        }
    };
    

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("noticeTitle", notice.noticeTitle); // 제목
            formData.append("noticeContent", notice.noticeContent); // 내용
            if (notice.updatedFile) {
                formData.append("file", notice.updatedFile); // 파일 추가
            }

            // 요청 전 formData 확인 (디버깅용)
            formData.forEach((value, key) => console.log(`${key}: ${value}`));

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

    const fetchImage = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("이미지 로드 실패");
            const blob = await response.blob(); // Blob 데이터를 받아옴
            return URL.createObjectURL(blob); // Blob URL 생성
        } catch (error) {
            console.error("이미지 로드 오류:", error);
            return "/default-image.png"; // 대체 이미지 설정
        }
    };

    const isImageFile = (filePath) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        const extension = filePath.split('.').pop().toLowerCase();
        console.log("확인 중인 파일 경로:", filePath, "확장자:", extension); // 파일 경로 및 확장자 확인
        return imageExtensions.includes(extension);
    };

    useEffect(() => {
        handleNoticeDetail();
    }, []);

    if (!notice) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    return (
        <div className={styles.noticecontainer}>
            <h2 className={styles.noticetitle}>
                <input
                    type="text"
                    value={notice.noticeTitle}
                    onChange={(e) =>
                        setNotice((prev) => ({ ...prev, noticeTitle: e.target.value }))
                    }
                    className={styles.noticenewtitle}
                />
            </h2>

            <div className={styles.noticeinfo}>
                <span>작성일: {new Date(notice.noticeWDate).toLocaleDateString()}</span>
                {notice.noticeUDate && (
                    <span className={styles.spacer}>
                        수정일: {new Date(notice.noticeUDate).toLocaleDateString()}
                    </span>
                )}
                <br />
                <span>조회수: {notice.noticeVCount}</span>
            </div>

            <div className={styles.noticecontent}>
                <textarea
                    value={notice.noticeContent}
                    onChange={(e) =>
                        setNotice((prev) => ({ ...prev, noticeContent: e.target.value }))
                    }
                    className={styles.textarea}
                ></textarea>
            </div>

            {notice.noticePath && (
                <div className={styles.noticeImageContainer}>
                    <img src={`http://localhost:8080/attachments/${notice.noticePath}`}
                        alt={notice.noticePath.split('/').pop().replace('N_', '')}
                        className={styles.noticeImage}
                    />
            <div>
                <label htmlFor="fileUpload">파일 업로드:</label>
                <input
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                />
                    {isImageFile(notice.noticePath) ? (
                        <img src={filePreview}
                            alt={notice.noticePath.split('/').pop()} className={styles.noticeImage}
                        />
                    ) : (
                        <div className={styles.fileName}>
                            {notice.noticePath.split('/').pop()}
                        </div>
                    )}                
            </div>
            </div>
            )}

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
