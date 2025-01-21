import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./NoticeInsert.module.css";
import InsertButton from "../../components/common/button/InsertButton";
import axios from "axios";

function NoticeInsert() {
    const { secureApiRequest } = useContext(AuthContext);
    const [noticetitle, setNoticeTitle] = useState("");
    const [noticecontent, setNoticeContent] = useState("");
    const [noticefile, setNoticeFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const uuid = localStorage.getItem("uuid");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/notice");
    };

    const handleNoticeInsert = async () => {
        try {
            if (window.confirm("공지를 등록하시겠습니까?")) {
                const formData = new FormData();
                formData.append("uuid", uuid);
                formData.append("noticeTitle", noticetitle);
                formData.append("noticeContent", noticecontent);
    
                if (noticefile) {
                    formData.append("file", noticefile);
                }
    
                const accessToken = localStorage.getItem("accessToken");
                const refreshToken = localStorage.getItem("refreshToken");
    
                if (!accessToken || !refreshToken) {
                    alert("로그인이 필요합니다.");
                    return;
                }
    
                const response = await axios.post("http://localhost:8080/notice/insert", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${accessToken}`, // AccessToken 추가
                        "RefreshToken": `Bearer ${refreshToken}`, // RefreshToken 추가
                    },
                });
    
                console.log("response:", response.data);
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
            reader.onload = () => setFilePreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(null);
        }
    };

    return (
        <div className={styles.noticecontainer}>
            <h2 className={styles.noticetitle}>공지사항 등록</h2>
            <div className={styles.formGroup}>
                <input
                    type="text"
                    placeholder="공지 제목을 입력하세요."
                    value={noticetitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className={styles.noticenewtitle}
                />
            </div>
            <div className={styles.formGroup}>
                <textarea
                    placeholder="공지 내용을 입력하세요."
                    value={noticecontent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className={styles.textarea}
                   ></textarea>
            </div>
            <div className={styles.fileInput}>
                <input type="file" onChange={handleFileChange} />
                {filePreview && <img src={filePreview} alt="미리보기" className={styles.previewImage} />}
            </div>
            <div className={styles.buttonGroup}>
                <button onClick={handleBack} className={styles.backButton}>이전으로</button>
                <InsertButton onClick={handleNoticeInsert} label="공지 등록"/>
            </div>
        </div>
    );    
}

export default NoticeInsert;
