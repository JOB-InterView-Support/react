import React, { useEffect, useState, useContext  } from 'react';
import apiClient from "../../utils/axios";
import styles from './TicketDetail.module.css';
import TicketSubMenubar from "../../components/common/subMenubar/TicketSubMenubar";


import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import { useNavigate } from "react-router-dom";

function TicketDetail(){
    const [userName, setUserName] = useState(null); // 사용자 이름 상태
    const [prodDescription, setProdDescription] = useState(null);   // 이용권 내용 상태

    const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);  
    const navigate = useNavigate();
    const [ticket, setTicket] = useState([]); // Ticket 정보를 담을 상태

    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/login"); // 로그인 페이지로 이동
        }
    }, [isLoggedIn,  navigate]);

    // 날짜 포맷팅 함수
    function formatDateTime(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    }

    useEffect(() => {
        const fetchLatestTicket = async () => {
            try {
                const response = await secureApiRequest("/ticket/latest", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
    
                if (response.status === 200 && response.data?.data) {
                    setTicket(response.data.data); // 티켓 데이터 설정
                    setUserName(response.data.userName); // 사용자 이름 설정
                    setProdDescription(response.data.prodDescription); // prodDescription 설정
                    console.log("Fetched prodDescription:", response.data.prodDescription);
                } else {
                    console.error("No active ticket found.");
                }
            } catch (error) {
                console.error("Error fetching latest ticket:", error);
            }
        };
    
        fetchLatestTicket();
    }, [secureApiRequest, isLoggedIn]);
    
    const handleRefund = async (paymentKey) => {
        const userConfirmed = window.confirm("이 티켓을 환불하시겠습니까?");
    
        if (!userConfirmed) {
          return; // 사용자가 취소한 경우
        }
    
        try {
          const accessToken = localStorage.getItem("accessToken");
    
          // 1. 환불 상태 확인
          const response = await apiClient.get(
            `/api/payments/checkRefund/${paymentKey}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
    
          console.log("Refund status response:", response.data);
    
          // 2. cancelYN 확인
          if (response.data.cancelYN === "Y") {
            alert("이미 환불된 이용권입니다.");
            return;
          }
    
          // 3. ticketCount와 prodNumberOfTime 비교
          if (ticket.ticketCount === ticket.prodNumberOfTime) {
            // 4. 환불 요청 API 호출
            const refundResponse = await apiClient.put(
              `/api/payments/refund/${paymentKey}`,
              null,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
    
            if (refundResponse.status === 200) {
              alert("환불이 성공적으로 처리되었습니다.");
              navigate("/TicketDetail");
            } else {
              throw new Error(refundResponse.data.message || "환불 실패");
            }
          } else {
            alert(
              "환불할 수 없는 이용권입니다. 사용 가능한 횟수가 남아있거나 조건이 맞지 않습니다."
            );
          }
        } catch (error) {
          console.error("환불 처리 중 오류 발생:", error);
          alert("환불 요청 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
      };


    return(
    <>
        <TicketSubMenubar/>
        <div className={styles.paymentContainer}>
            <h1 className={styles.paymentTitle}>현재 활성화 된 이용권</h1>

            <div className={styles.paymentBox}>
                <table className={styles.paymentTable}>
                    <tbody>
                        <tr>
                            <th>활성화 된 이용권</th>
                            <td>{ticket.ticketName || "이용 가능한 이용권이 존재하지 않습니다."}</td>
                        </tr>
                        <tr>
                            <th>유효 기간</th>
                            <td>{formatDateTime(ticket.ticketEndDate) || "-"}</td>
                        </tr>
                        <tr>
                            <th>상품 내용</th>
                            <td>{prodDescription || "-"}</td>
                        </tr>
                        <tr>
                            <th>결제자</th>
                            <td>{userName || "알 수 없음"}</td>
                        </tr>
                        <tr>
                            <th>결제 금액</th>
                            <td>{ticket.ticketAmount || 0} 원</td>
                        </tr>
                        <tr>
                            <th>결제 번호</th>
                            <td>{ticket.paymentKey || "-"}</td>
                        </tr>
                        <tr>
                            <th>결제일자</th>
                            <td>{formatDateTime(ticket.ticketStartDate) || "-"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.buttonGroup}>
                <button
                    className={styles.cancelButton}
                    onClick={() => handleRefund(ticket.paymentKey)}
                >
                    환불 진행
                </button>
                <button className={styles.backButton} onClick={() => navigate(-1)}>돌아가기</button>
            </div>
        </div>
    </>
    )

    
}

export default TicketDetail;