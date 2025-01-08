import React, { useEffect, useState, useContext  } from 'react';
import apiClient from "../../utils/axios";
import styles from './TicketDetail.module.css';
import TicketSubMenubar from "../../components/common/subMenubar/TicketSubMenubar";


import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import { useNavigate } from "react-router-dom";

function TicketDetail(){

    const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);  
    const navigate = useNavigate();
    const [ticket, setTicket] = useState([]); // Ticket 정보를 담을 상태
     
    const handleRefund = async (paymentKey) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
    
            const response = await apiClient.put(
                `/api/payments/refund/${paymentKey}`,
                null, // PUT 요청에 Body는 필요 없음
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                        RefreshToken: `Bearer ${refreshToken}`,
                    },
                }
            );
    
            if (response.status === 200) {
                alert("환불이 성공적으로 처리되었습니다.");
            } else {
                throw new Error(response.data.message || "환불 실패");
            }
        } catch (error) {
            console.error("환불 요청 실패:", error);
            alert("환불 요청 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/login"); // 로그인 페이지로 이동
        }
    }, [isLoggedIn,  navigate]);


    useEffect(() => {
        // Ticket 데이터 가져오기
        async function fetchTicket() {
            setIsLoading(true);
            try {
                const accessToken = localStorage.getItem("accessToken");
                const refreshToken = localStorage.getItem("refreshToken");
                
                const response = await apiClient.get("/ticket",  {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // 인증 헤더에 AccessToken 추가
                        refreshToken: `Bearer ${refreshToken}`, // 인증 헤더에 RefreshToken 추가
                    },
                });
                
                
                if (Array.isArray(response.data)) {
                    const validatedTicket = response.data((ticket) => ({
                        ...ticket,
                        ticketAmount: Number(ticket.ticketAmount), // 보정
                        ticketCount: Number(ticket.ticketCount), // 보정
                    }));
                    setTicket(validatedTicket);
                } else {
                    console.error("API response is not an array:", response.data);
                }
                console.log("ticket " + JSON.stringify(ticket) );
                console.log("response " + JSON.stringify(response.data) );
            } catch (error) {
                console.error("Failed to fetch ticket:", error);
            } finally {
                setIsLoading(false);
            }
        } fetchTicket();
    }, []);
    



    return(
        <div>
        <TicketSubMenubar/>
            <div className={styles.paymentContainer}>
                    <h1 className={styles.paymentTitle}>이용권 상세 내역</h1>

                    <div className={styles.paymentBox}>
                        <table className={styles.paymentTable}>
                        <tbody>
                            <tr>
                                <th>선택한 이용권</th>
                                <td>24시간 / 1회</td>
                            </tr>
                            <tr>
                                <th>유효 기간</th>
                                <td>사용일로부터 24시간</td>
                            </tr>
                            <tr>
                                <th>상품 내용</th>
                                <td>자기소개서 분석 + AI 모의면접 + AI 면접 채점&풀이 제공</td>
                            </tr>
                            <tr>
                                <th>결제 방식</th>
                                <td>카카오페이</td>
                            </tr>
                            <tr>
                                <th>결제자</th>
                                <td>홍길동</td>
                            </tr>
                            <tr>
                                <th>결제 금액</th>
                                <td>9900 원</td>
                            </tr>
                            <tr>
                                <th>결제 번호</th>
                                <td>280a8a4d-a27f-4041-b031-2a003cc4c039</td>
                            </tr>
                            <tr>
                                <th>결제일자</th>
                                <td>2024.11.03 (토) 13시 46분</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>

                    <div className={styles.buttonGroup}>
                    <button
                        className={styles.cancelButton}
                        onClick={() => handleRefund("280a8a4d-a27f-4041-b031-2a003cc4c039")} // paymentKey 전달
                    >
                        환불 진행
                    </button>
                        <button className={styles.backButton}>돌아가기</button>
                    </div>
                </div>
            </div>
        

    )

    
}

export default TicketDetail;