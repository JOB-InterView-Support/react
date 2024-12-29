import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeUpdate.module.css"; // CSS Modules

function NoticeUpdate() {
    const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
    const {no} = useParams();    
    const [noticetitle, setNoticeTitle] = useState("");
    const [noticecontent, setNoticeContent] = useState("");
    const [noticefile, setNoticeFile] = useState(null);
    const [noticepreview, setNoticePreview] = useState(null);
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);

    const handleBack = () => {
        navigate(-1);
    };

    const handleNoticeUpdate = async () => {
        try{
            const response = await secureApiRequest(`/notice/update/${no}`, {
                method : "PUT",
            });
            console.log("response : " + JSON.stringify(response.data));
            setNotice(response.data);
        } catch {
            alert("전송실패");
        }
    };

    return (
        <div className={styles.noticecontainer}>
            <div className={styles.noticetitle}>
                <input type="text" placeholder="공지 제목을 입력하세요."
                    value={noticetitle} onChange={(e) => setNoticeTitle(e.target.value)}
                    className={styles.noticenewtitle}
                />
            </div>
            <div className={styles.buttonGroup}>
                <button onClick={handleBack} className={styles.backButton}>이전으로</button>
                <button onClick={handleNoticeUpdate} label="공지 수정"/>
            </div>
        </div>
    );    
}

export default NoticeUpdate;