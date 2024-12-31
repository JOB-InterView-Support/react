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

    const handleBack = () => {
        navigate(-1);
    };

    const handleNoticeDetail = async () => {
        try {
            const response = await secureApiRequest(`/notice/detail/${no}`, {
                method: "GET",
            });
            setNotice(response.data);
        } catch (error) {
            console.error("공지사항 정보를 불러오지 못했습니다:", error);
            alert("공지사항 정보를 불러오지 못했습니다.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNotice((prev) => ({ ...prev, updatedFile: file }));
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
                    <img
                        src={`http://localhost:8080/attachments/${notice.noticePath}`}
                        alt={notice.noticePath.replace(/^N_/, "")}
                        className={styles.noticeImage}
                    />
                </div>
            )}

            <div>
                <label htmlFor="fileUpload">파일 업로드:</label>
                <input
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                />
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
