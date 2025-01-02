import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import styles from "./MyTicketList.module.css";

function MyTicketList() {
  const { secureApiRequest } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]); // 티켓 리스트
  const [selectedTicket, setSelectedTicket] = useState(null); // 선택된 티켓 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

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

        if (response.status < 200 || response.status >= 300) {
          console.error(`API 요청 실패: 상태 코드 ${response.status}`);
          return;
        }

        let ticketData = response.data;

        // 정렬: 사용 가능 횟수가 있는 데이터를 우선으로 정렬 후, 구매 날짜 내림차순
        ticketData = ticketData.sort((a, b) => {
          if (a.ticketCount > 0 && b.ticketCount === 0) return -1; // 사용 가능 횟수 우선
          if (a.ticketCount === 0 && b.ticketCount > 0) return 1; // 사용 가능 횟수 뒤로
          return new Date(b.ticketStartDate) - new Date(a.ticketStartDate); // 구매 날짜 내림차순
        });

        setTickets(ticketData);
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    };

    fetchTickets();
  }, [secureApiRequest]);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  const handleRefund = (ticketKey) => {
    console.log(`환불 요청: 티켓 키 ${ticketKey}`);
    // 환불 로직 추가 필요
  };

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
                <tr key={ticket.ticketKey} onClick={() => openModal(ticket)}>
                  <td>{ticket.ticketName}</td>
                  <td>
                    {ticket.ticketCount} / {ticket.prodNumberOfTime || "불명"}
                  </td>
                  <td>{ticket.ticketAmount.toLocaleString()}원</td>
                  <td>{new Date(ticket.ticketStartDate).toLocaleDateString()}</td>
                  <td>{new Date(ticket.ticketEndDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isModalOpen && selectedTicket && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>이용권 정보</h3>
              <p>이용권 이름: {selectedTicket.ticketName}</p>
              <p>
                사용 시작 날짜:{" "}
                {new Date(selectedTicket.ticketStartDate).toLocaleDateString()}
              </p>
              <p>
                만료 날짜:{" "}
                {new Date(selectedTicket.ticketEndDate).toLocaleDateString()}
              </p>
              <p>결제 금액: {selectedTicket.ticketAmount.toLocaleString()}원</p>
              <p>
                사용 가능 횟수: {selectedTicket.ticketCount} /{" "}
                {selectedTicket.prodNumberOfTime || "불명"}
              </p>
              {/* 환불 버튼 조건부 렌더링 */}
              {selectedTicket.ticketCount === selectedTicket.prodNumberOfTime && (
                <button
                  className={styles.refundButton}
                  onClick={() => handleRefund(selectedTicket.ticketKey)}
                >
                  환불하기
                </button>
              )}
              <button onClick={closeModal} className={styles.closeButton}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTicketList;
