import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeDetail.module.css"; // CSS Modules
import downloadIcon from "../../assets/images/download_icon.png";

function NoticeDetail() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    const { secureApiRequest, role } = useContext(AuthContext);
    const { no } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // 파일 미리보기 URL

    const handleBack = () => {
        navigate("/notice");
    };

    const isImageFile = (filePath) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        if (!filePath) return false; // 파일 경로가 없으면 false 반환
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
                // 파일이 이미지인지 확인
                if (isImageFile(response.data.noticePath)) {
                    setFilePreview(response.data.noticePath); // 이미지 파일 경로 설정
                } else {
                    // 이미지가 아닌 경우 fetch를 통해 미리보기 생성
                    const previewUrl = await fetchImage(response.data.noticePath);
                    if (previewUrl) {
                        setFilePreview(previewUrl);
                    }
                }
            }
        } catch (error) {
            console.error("공지사항 데이터를 불러오지 못했습니다.", error);
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
            return URL.createObjectURL(blob); // 미리보기 URL 생성
        } catch (error) {
            console.error("파일 미리보기 오류:", error);
            return null;
        }
    };

    const handleDownload = async () => {
        if (!notice.noticePath) {
            alert("다운로드할 파일이 없습니다.");
            return;
        }

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
            <h2 className={styles.noticetitle}>{notice.noticeTitle}
                {role === "ADMIN" && (
                    <div className={styles.buttonContainer}>
                        <button onClick={handleMoveUpdate} className={styles.updateButton}>수 정</button>
                        <button onClick={handleNoticeDelete} className={styles.deleteButton}>삭 제</button>
                    </div>
                )}
            </h2>
            <div className={styles.noticeinfo}>
                <span>작성일 : {notice.noticeWDate}</span>
                <br />
                <span>조회수 : {notice.noticeVCount}</span>
            </div>

            <div className={styles.noticecontent}
                dangerouslySetInnerHTML={{
                    __html: notice.noticeContent.replace(/\n/g, "<br />"),
                }}>
            </div>

            <p className={styles.list}>첨부파일 목록</p>
            {notice.noticePath ? (
                <button onClick={handleDownload} className={styles.downloadButton}>
                    <img src={downloadIcon} alt="Download Icon" className={styles.downloadIcon} />
                    {notice.noticePath.split('/').pop().replace("N_", "")}
                </button>
            ) : (
                <p className={styles.noFile}>첨부파일 없음</p>
            )}

            {notice.noticePath && filePreview && (
                <div className={styles.noticeImageContainer}>
                    <p className={styles.preview}>파일 미리보기</p>
                    {isImageFile(notice.noticePath) ? (
                        <img
                            src={filePreview}
                            alt="첨부파일 미리보기"
                            className={styles.noticeImage}
                        />
                    ) : (
                        <embed
                            src={filePreview}
                            type="application/pdf"
                            width="100%"
                            height="500px"
                            className={styles.embedPreview}
                        />
                    )}
                </div>
            )}

            <button onClick={handleBack} className={styles.backButton}>이전으로</button>
        </div>
    );
}

export default NoticeDetail;
