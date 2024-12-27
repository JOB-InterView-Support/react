import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./NoticeInsert.module.css";

function NoticeInsert() {
    const { secureApiRequest } = useContext(AuthContext);
    const [noticetitle, setNoticeTitle] = useState("");
    const [noticecontent, setNoticeContent] = useState("");
    const [noticefile, setNoticeFile] = useState(null);
    const [noticepreview, setNoticePreview] = useState(null);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/notice");
    };

    const handleNoticeInsert = async () => {
        try {
            if (window.confirm('공지를 등록하시겠습니까?')) {
                const formData = new FormData();
                formData.append("noticetitle", noticetitle);
                formData.append("noticecontent", noticecontent);
                if (noticefile) {
                    formData.append("file", noticefile);
                }

                const response = await secureApiRequest(`/notice/insert`, {
                    method: "POST",
                    body: formData,
                });
                console.log("response : " + JSON.stringify(response.data));
                navigate(-1);
            }
        } catch (err) {
            console.error("전송 실패:", err);
            alert("공지 등록에 실패했습니다.");
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setNoticeFile(selectedFile);

        if (selectedFile && selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setNoticePreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setNoticePreview(null);
        }
    };

    return (
        <div className={styles.noticecontainer}>
            <h2 className={styles.noticetitle}>공지사항 등록</h2>
            <div className={styles.formGroup}>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={noticetitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className={styles.noticetitle}
                />
            </div>
            <div className={styles.formGroup}>
                <textarea
                    placeholder="내용을 입력하세요"
                    value={noticecontent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className={styles.textarea}
                ></textarea>
            </div>
            <div className={styles.fileInput}>
                <input type="file" onChange={handleFileChange} />
                {noticepreview && <img src={noticepreview} alt="미리보기" className={styles.previewImage} />}
            </div>
            <div className={styles.buttonGroup}>
                <button onClick={handleBack} className={styles.backButton}>이전으로</button>
                <button onClick={handleNoticeInsert} className={styles.insertButton}>공지 등록</button>
            </div>
        </div>
    );    
}

export default NoticeInsert;
