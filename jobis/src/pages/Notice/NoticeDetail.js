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
        console.log("이전 버튼 클릭"); // 이전 버튼 클릭 로그
        navigate("/notice");
    };

    const isImageFile = (filePath) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        const extension = filePath.split('.').pop().toLowerCase();
        console.log("확인 중인 파일 경로:", filePath, "확장자:", extension); // 파일 경로 및 확장자 확인
        return imageExtensions.includes(extension);
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

    const handleMoveUpdate = () => {
        console.log("수정 버튼 클릭"); // 수정 버튼 클릭 로그
        navigate(`/notice/update/${no}`);
    };

    const handleNoticeDelete = async () => {
        try {
            if (window.confirm('정말 삭제하시겠습니까?')) {
                console.log("삭제 요청 전송:", `/notice/detail/${no}`); // 삭제 요청 전송 로그
                const response = await secureApiRequest(`/notice/detail/${no}`, {
                    method: "put",
                });
                console.log("삭제 요청 응답:", response); // 삭제 요청 성공 로그
                navigate("/notice");
            }
        } catch (error) {
            console.error("삭제 요청 중 오류 발생:", error); // 삭제 요청 실패 로그
        }
    };

    // const fetchImage = async (url) => {
    //     try {     
            
    //         const token = localStorage.getItem("authToken"); // 인증 토큰 가져오기
    //         const response = await fetch(notice.noticePath, url, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`, // 인증 헤더 추가
    //                 refreshToken: `Bearer ${refreshToken}`,
    //             },
    //         });
    //         if (!response.ok) throw new Error("이미지 로드 실패");
    //         const blob = await response.blob(); // 서버에서 Blob 데이터 가져오기
    //         return URL.createObjectURL(blob); // Blob URL 생성
    //     } catch (error) {
    //         console.error("이미지 로드 오류:", error);
    //         return "/default-image.png"; // 대체 이미지
    //     }
    // };

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
    

    // 다운로드 기능 추가
    // const handleDownload = async () => {
    //     try {
    //         const token = localStorage.getItem("authToken"); // 인증 토큰 가져오기
    //         const response = await fetch(notice.noticePath, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`, // 인증 헤더 추가
    //                 refreshToken: `Bearer ${refreshToken}`,
    //             },
    //         });
    
    //         if (!response.ok) {
    //             throw new Error("파일 다운로드 실패");
    //         }
    
    //         const blob = await response.blob(); // Blob 데이터 가져오기
    //         const blobUrl = URL.createObjectURL(blob); // Blob URL 생성
    
    //         // 동적으로 a 태그 생성
    //         const a = document.createElement("a");
    //         a.href = blobUrl;
    //         a.download = notice.noticePath.split('/').pop(); // 파일 이름 설정
    //         document.body.appendChild(a);
    //         a.click(); // 클릭 이벤트로 다운로드 실행
    //         document.body.removeChild(a); // 다운로드 후 태그 제거
    
    //         // Blob URL 메모리 해제
    //         URL.revokeObjectURL(blobUrl);
    //         console.log("다운로드 성공");
    //     } catch (error) {
    //         console.error("다운로드 오류:", error);
    //         alert("파일 다운로드에 실패했습니다.");
    //     }
    // };

    // const handleDownload = async () => {
    //     try {
    //         // 중복된 URL 처리
    //         let downloadUrl = notice.noticePath;
    //         if (downloadUrl.startsWith("http://localhost:8080/notice/attachments/")) {
    //             downloadUrl = downloadUrl.replace("http://localhost:8080/notice/attachments/", "http://localhost:8080/attachments/");
    //         }
    
    //         // 파일 다운로드 요청
    //         const response = await fetch(downloadUrl, {
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 refreshToken: `Bearer ${refreshToken}`,
    //             },
    //         });
    
    //         if (!response.ok) throw new Error("파일 다운로드 실패");
    
    //         // Blob 생성 및 다운로드 처리
    //         const blob = await response.blob();
    //         const blobUrl = URL.createObjectURL(blob);
    
    //         const a = document.createElement("a");
    //         a.href = blobUrl;
    //         a.download = downloadUrl.split('/').pop(); // 파일 이름 추출
    //         document.body.appendChild(a);
    //         a.click();
    //         document.body.removeChild(a);
    
    //         URL.revokeObjectURL(blobUrl);
    //         console.log("다운로드 성공");
    //     } catch (error) {
    //         console.error("다운로드 오류:", error);
    //         alert("파일 다운로드에 실패했습니다.");
    //     }
    // };

    const handleDownload = async () => {
        try {
            console.log("다운로드 요청 경로:", notice.noticePath);
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
            a.download = notice.noticePath.split('/').pop(); // 파일 이름
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
    
            URL.revokeObjectURL(blobUrl);
            console.log("다운로드 성공");
        } catch (error) {
            console.error("다운로드 오류:", error);
            alert("파일 다운로드에 실패했습니다.");
        }
    };
    

    useEffect(() => {
        console.log("useEffect 실행 - Notice ID:", no); // useEffect 실행 로그
        handleNoticeDetail();
    }, []);

    if (!notice) {
        console.log("로딩 중..."); // 로딩 상태 로그
        return (
            <div className={styles.loading}>
                <p>로딩 중입니다...</p>
            </div>
        );
    }

    console.log("Notice 데이터:", notice); // Notice 데이터 출력
    console.log("Notice Path:", notice.noticePath); // Notice Path 출력

    return (
        <div className={styles.noticecontainer}>
            <h2 className={styles.noticetitle}>{notice.noticeTitle}</h2>

            <div className={styles.noticeinfo}>
                <span className="spacer">작성일 : {notice.noticeWDate}</span><br />
                <span className="spacer">조회수 : {notice.noticeVCount}</span>
            </div>

            <div className={styles.noticecontent}>{notice.noticeContent}</div>
            {notice.noticePath && (
                <div className={styles.fileContainer}>
                    {/* 파일명 링크 */}
                    <a href={notice.noticePath}
                        download={notice.noticePath.split('/').pop().replace('N_', '')}
                        className={styles.downloadLink}>
                        첨부파일 미리보기
                    </a>                    
                </div>
            )}
                                {/* 파일 아이콘 */}
                                <span className={styles.fileIcon}>
                        <img src={downloadIcon} alt="파일 아이콘" />
                    </span>
            {filePreview && (
                <div className={styles.noticeImageContainer}>
                    {isImageFile(notice.noticePath) ? (
                        <img src={filePreview}
                            alt={notice.noticePath.split('/').pop()} className={styles.noticeImage}
                        />
                    ) : (
                        <div className={styles.fileName}>
                            {notice.noticePath.split('/').pop()}
                        </div>
                    )}
                    <button onClick={handleDownload} className={styles.downloadButton}>{notice.noticePath.split('/').pop().replace(/^N_/, '')}</button>
                </div>
            )}
            <button onClick={handleBack} className={styles.backButton}>이전으로</button>

            {role === "ADMIN" && (
                <div className={styles.buttonContainer}>
                    <button onClick={handleMoveUpdate}>수 정</button>
                    <button onClick={handleNoticeDelete}>삭 제</button>
                </div>
            )}
        </div>
    );
}

export default NoticeDetail;
