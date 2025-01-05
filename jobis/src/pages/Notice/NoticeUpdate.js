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
    const [filePreview, setFilePreview] = useState(null);
    const [noticeFile, setNoticeFile] = useState(null);
    const [originalNoticePath, setOriginalNoticePath] = useState(null);
    const [isFileDeleted, setIsFileDeleted] = useState(false);

    // 뒤로가기 버튼 핸들러
    const handleBack = () => navigate(-1);

    // 이미지 파일 여부 확인 함수
    const isImageFile = (filePath) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
        const extension = filePath?.split(".").pop().toLowerCase();
        return imageExtensions.includes(extension);
    };

    // 공지사항 상세 데이터 가져오기
    const handleNoticeDetail = async () => {
        try {
            const response = await secureApiRequest(`/notice/detail/${no}`, { method: "GET" });
            const { noticeTitle, noticeContent, noticePath } = response.data;

            setNoticeTitle(noticeTitle || "");
            setNoticeContent(noticeContent || "");

            if (noticePath) {
                const isAbsolutePath = noticePath.startsWith("http://") || noticePath.startsWith("https://");
                const fullPath = isAbsolutePath ? noticePath : `http://localhost:8080/attachments/${noticePath}`;
                setFilePreview(fullPath);
                setOriginalNoticePath(fullPath);
            }
        } catch (error) {
            console.error("공지사항 데이터를 불러오지 못했습니다:", error);
        }
    };

    // 첨부파일 삭제 핸들러
    // const handleFileDelete = async () => {
    //     if (!originalNoticePath) {
    //         alert("삭제할 파일이 없습니다.");
    //         return;
    //     }

    //     if (window.confirm("첨부파일을 삭제하시겠습니까?")) {
    //         try {
    //             console.log("첨부파일 삭제 요청 실행");
    //             await secureApiRequest(`/notice/update/${no}`, {
    //                 method: "put",
    //             });

    //             setIsFileDeleted(true); // 삭제 상태로 설정
    //             setFilePreview(null); // 미리보기 제거
    //             setOriginalNoticePath(null); // 원본 경로 초기화
    //             setNoticeFile(null); // 업로드 파일 초기화
    //             alert("첨부파일이 성공적으로 삭제되었습니다.");
    //         } catch (error) {
    //             console.error("첨부파일 삭제 요청 실패:", error);
    //             alert("첨부파일 삭제 중 오류가 발생했습니다.");
    //         }
    //     }
    // };

    // 첨부파일 삭제 핸들러
    const handleFileDelete = async () => {
        if (!originalNoticePath) {
            alert("삭제할 파일이 없습니다.");
            return;
        }
    
        if (window.confirm("첨부파일을 삭제하시겠습니까?")) {
            try {
                console.log("첨부파일 삭제 요청 실행");
    
                await secureApiRequest(`/notice/update/${no}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        deleteFile: true, // 첨부파일 삭제 플래그만 전달
                    }),
                });
    
                setIsFileDeleted(true); // 삭제 상태 설정
                setFilePreview(null); // 미리보기 제거
                setOriginalNoticePath(null); // 원본 경로 초기화
                setNoticeFile(null); // 업로드 파일 초기화
                alert("첨부파일이 성공적으로 삭제되었습니다.");
            } catch (error) {
                console.error("첨부파일 삭제 요청 실패:", error);
                alert("첨부파일 삭제 중 오류가 발생했습니다.");
            }
        }
    };
    


    // 파일 변경 핸들러
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setNoticeFile(selectedFile);

        if (selectedFile) {
            const isImage = selectedFile.name.match(/\.(jpg|jpeg|png|gif|bmp)$/i);
            if (isImage) {
                const reader = new FileReader();
                reader.onload = (event) => setFilePreview(event.target.result);
                reader.readAsDataURL(selectedFile);
            } else {
                setFilePreview(null);
                alert("이미지가 아닌 파일은 미리보기를 지원하지 않습니다.");
            }
        }
    };

    // 공지사항 업데이트 핸들러
    // const handleUpdate = async () => {
    //     try {
    //         const formData = new FormData();
    //         formData.append("noticeTitle", noticeTitle);
    //         formData.append("noticeContent", noticeContent);

    //         if (noticeFile) {
    //             formData.append("file", noticeFile);
    //         } else if (isFileDeleted) {
    //             formData.append("deleteFile", "true");
    //         }

    //         await axios.put(`http://localhost:8080/notice/update/${no}`, formData, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //                 refreshToken: `Bearer ${localStorage.getItem("refreshToken")}`,
    //             },
    //         });

    //         alert("공지사항이 성공적으로 수정되었습니다.");
    //         navigate(`/notice/detail/${no}`);
    //     } catch (error) {
    //         console.error("공지사항 수정 요청 실패:", error.response || error.message);
    //         alert("공지사항 수정 요청 중 오류가 발생했습니다.");
    //     }
    // };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("noticeTitle", noticeTitle);
            formData.append("noticeContent", noticeContent);
    
            if (noticeFile) {
                formData.append("file", noticeFile); // 새 파일 추가
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
            console.error("공지사항 수정 요청 실패:", error.response || error.message);
            alert("공지사항 수정 요청 중 오류가 발생했습니다.");
        }
    };
    

    // 초기화
    useEffect(() => {
        handleNoticeDetail();
    }, []);

    return (
        <div className={styles.noticecontainer}>
            <h2 className={styles.noticeupdate}>공지사항 수정</h2>
            <h2 className={styles.noticetitle}>
                <input
                    type="text"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className={styles.noticetitle}
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
                            alt="새 첨부파일 미리보기"
                            className={styles.previewImage}
                            onError={() => console.error("미리보기 이미지 로드 실패:", filePreview)}
                        />
                    ) : (
                        <></>
                    )
                ) : (
                    <span>첨부파일 없음</span>
                )}
                {filePreview && (
                    <button onClick={handleFileDelete} className={styles.deleteButton}>
                        첨부파일 삭제
                    </button>
                )}
            </div>

            <div className={styles.buttonGroup}>
            <button onClick={handleBack} className={styles.backButton}>이전으로</button>
                <button onClick={handleUpdate} className={styles.saveButton}>
                    저장
                </button>
            </div>
        </div>
    );
}

export default NoticeUpdate;
