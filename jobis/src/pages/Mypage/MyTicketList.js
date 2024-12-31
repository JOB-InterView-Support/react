import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import styles from "./MyTicketList.module.css";
import { useNavigate } from "react-router-dom";

function MyTicketList() {
  const { secureApiRequest } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const storedUuid = localStorage.getItem("uuid");
  
      if (!storedUuid) {
        console.error("로컬 스토리지에 UUID가 없습니다.");
        return;
      }
  
      try {
        const response = await secureApiRequest(`/mypage/ticket/${storedUuid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        // Axios 응답 객체 사용
        console.log(`응답 상태 코드: ${response.status}`);
        console.log(`응답 상태 텍스트: ${response.statusText}`);
  
        if (response.status < 200 || response.status >= 300) {
          console.error(`API 요청 실패: 상태 코드 ${response.status}, 메시지: ${response.statusText}`);
          return;
        }
  
        // 데이터 처리
        const ticketData = response.data;
        console.log("응답 데이터:", ticketData);
  
        if (!ticketData || ticketData.length === 0) {
          console.warn("티켓 데이터가 없습니다.");
          setTickets([]);
        } else {
          setTickets(ticketData);
        }
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    };
  
    fetchTickets();
  }, [secureApiRequest]);

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <h2 className={styles.subTitle}>이용권 내역</h2>
        {tickets.length === 0 ? (
          <p className={styles.noTickets}>이용권 구매 내역이 존재하지 않습니다.</p>
        ) : (
          <table className={styles.ticketTable}>
            <thead>
              <tr>
                <th>이용권 이름</th>
                <th>잔여 횟수</th>
                <th>결제 금액</th>
                <th>구매 날짜</th>
                <th>사용 기한</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticketKey}>
                  <td>{ticket.ticketName}</td>
                  <td>{ticket.ticketCount}</td>
                  <td>{ticket.ticketAmount.toLocaleString()}원</td>
                  <td>{new Date(ticket.ticketStartDate).toLocaleDateString()}</td>
                  <td>{new Date(ticket.ticketEndDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyTicketList;
