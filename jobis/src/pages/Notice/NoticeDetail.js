import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeDetail.module.css"; // CSS Modules
import { DeleteButton } from "../../components/common/button/DeleteButton.js"


function NoticeDetail() {
    const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
    const {no} = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);

    const handleBack = () => {
        navigate("/notice");
    };

    const handleNoticeDetail = async () => {
        try{
            const response = await secureApiRequest(`/notice/detail/${no}`, {
                method : "GET",
            });
            console.log("response : " + JSON.stringify(response.data));
            setNotice(response.data);
        } catch {
            alert("전송실패");
        }
    };

    const handleMoveUpdate = () => {
        navigate(`/notice/update/${no}`);
        console.log("handleMoveUpdate : " + JSON.stringify(handleMoveUpdate.data));
        }

        const handleNoticeDelete = async () => {
            try {
                if (window.confirm('정말 삭제하시겠습니까?')) {
                    console.log("삭제 요청 전송:", `/notice/detail/${no}`);
                    
                    // PUT 메서드로 변경
                    const response = await secureApiRequest(`/notice/detail/${no}`, {
                        method: "PUT", // PUT 메서드 사용
                    });
        
                    console.log("삭제 요청 응답:", response);
        
                    navigate(-1); // 이전 페이지로 이동
                }
            } catch (error) {
                console.error("삭제 요청 중 오류 발생:", error);
                alert("전송 실패");
            }
        };
        


    useEffect(() => {
        handleNoticeDetail();
        console.log("notice : " + JSON.stringify(no));
    }, []); 

    if (!notice) {
        return <div className={styles.loading}>로딩 중...</div>; // 로딩 표시
    }

    return (  
        <div className={styles.noticecontainer}>
            <h2 className={styles.noticetitle}>{notice.noticeTitle}</h2>

                    <div className={styles.noticeinfo}>
                        <span className="spacer">작성일 : {notice.noticeWDate}</span><br></br>
                        <span className="spacer">조회수 : {notice.noticeVCount}</span>

                </div>
                <div className={styles.noticecontent}>{notice.noticeContent}</div>   
                {notice.noticePath && (
                <div className={styles.noticeImageContainer}>
                    <a href={notice.noticePath} download>
                    <img src={notice.noticePath} // 백엔드에서 제공한 이미지 경로
                        alt={notice.noticePath.replace(/^.+\/N_|^N_/, '')}  className={styles.noticeImage}
                    /></a>
                </div>
            )}

                <br></br>                
                <br></br>
                <br></br>
                <br></br>
                <br></br>
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