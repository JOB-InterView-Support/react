import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeDetail.module.css"; // CSS Modules
import downloadIcon from "../../assets/images/download_icon.png";

function NoticeDetail() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
    const { no } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // 파일 미리보기 URL

    const handleBack = () => {
        navigate("/notice");
    };

    const isImageFile = (filePath) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        const extension = filePath.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension);
    };

    const handleNoticeDetail = async () => {
        try {
            const response = await secureApiRequest(`/notice/detail/${no}`, {
                method: "GET",
            });
            setNotice(response.data);

            if (response.data.noticePath) {
                if (isImageFile(response.data.noticePath)) {
                    // 이미지 파일의 경우 바로 설정
                    setFilePreview(response.data.noticePath);
                } else {
                    // 이미지가 아닌 경우 fetch를 통해 미리보기 생성
                    const previewUrl = await fetchImage(response.data.noticePath);
                    if (previewUrl) {
                        setFilePreview(previewUrl);
                    }
                }
            }
        } catch {
            console.error("공지사항 데이터를 불러오지 못했습니다.");
        }
    };

    const handleMoveUpdate = () => {
        navigate(`/notice/update/${no}`);
    };

    const handleNoticeDelete = async () => {
        try {
            if (window.confirm('정말 삭제하시겠습니까?')) {
                await secureApiRequest(`/notice/detail/${no}`, {
                    method: "put",
                });
                navigate("/notice");
            }
        } catch (error) {
            console.error("삭제 요청 중 오류 발생:", error);
        }
    };

    const fetchImage = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("파일 로드 실패");
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("파일 미리보기 오류:", error);
            return null;
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(notice.noticePath, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    refreshToken: `Bearer ${refreshToken}`,
                },
            });

            if (!response.ok) throw new Error("파일 다운로드 실패");

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = notice.noticePath.split('/').pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("다운로드 오류:", error);
            alert("파일 다운로드에 실패했습니다.");
        }
    };

    const isSupportedFile = (filePath) => {
        const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf', 'txt'];
        const extension = filePath.split('.').pop().toLowerCase();
        return supportedExtensions.includes(extension);
    };

    useEffect(() => {
        handleNoticeDetail();
    }, []);

    if (!notice) {
        return (
            <div className={styles.loading}>
                <p>로딩 중입니다...</p>
            </div>
        );
    }

    return (
        <div className={styles.noticecontainer}>
            <h2 className={styles.noticetitle}>{notice.noticeTitle}</h2>

            <div className={styles.noticeinfo}>
                <span>작성일 : {notice.noticeWDate}</span>
                <br />
                <span>조회수 : {notice.noticeVCount}</span>
            </div>

            <div className={styles.noticecontent}>{notice.noticeContent}</div>

            {notice.noticePath && (
                <div className={styles.noticeImageContainer}>
                    {isSupportedFile(notice.noticePath) ? (
                        isImageFile(notice.noticePath) ? (
                            // 이미지 파일 자동 미리보기
                            <img
                                src={filePreview}
                                alt={notice.noticePath.split('/').pop()}
                                className={styles.noticeImage}
                            />
                        ) : (
                            filePreview ? (
                                <embed
                                    src={filePreview}
                                    type="application/pdf"
                                    width="100%"
                                    height="500px"
                                    className={styles.embedPreview}
                                    onError={() => {
                                        console.warn("브라우저에서 지원하지 않는 파일입니다.");
                                        setFilePreview(null);
                                    }}
                                />
                            ) : (
                                <p className={styles.unsupportedMessage}>
                                    미리보기를 지원하지 않는 파일 형식입니다.
                                </p>
                            )
                        )
                    ) : (
                        <p className={styles.unsupportedMessage}>
                            미리보기를 지원하지 않는 파일 형식입니다.
                        </p>
                    )}
                    <button
                        onClick={handleDownload}
                        className={styles.downloadButton}
                    >
                        <img
                            src={downloadIcon}
                            alt="Download Icon"
                            className={styles.downloadIcon}
                        />
                        {notice.noticePath.split('/').pop().replace("N_", "")}
                    </button>
                </div>
            )}

            <button onClick={handleBack} className={styles.backButton}>이전으로</button>

            {role === "ADMIN" && (
                <div className={styles.buttonContainer}>
                    <button onClick={handleMoveUpdate} className={styles.updateButton}>수 정</button>
                    <button onClick={handleNoticeDelete} className={styles.deleteButton}>삭 제</button>
                </div>
            )}
        </div>
    );
}

export default NoticeDetail;
