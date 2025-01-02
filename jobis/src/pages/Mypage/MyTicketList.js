import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import styles from "./MyTicketList.module.css";
import { useNavigate } from "react-router-dom";

function MyTicketList() {
  const { secureApiRequest } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // 선택된 티켓 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [totalCount, setTotalCount] = useState(null); // 추가 데이터 저장

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

        const ticketData = response.data;
        setTickets(ticketData);
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    };

    fetchTickets();
  }, [secureApiRequest]);

  const fetchProductData = async (prodNumber) => {
    try {
      const response = await secureApiRequest(`/products/${prodNumber}`, {
        method: "GET",
      });
      console.log("요청된 prodNumber:", prodNumber);
      if (!response || response.status < 200 || response.status >= 300) {
        console.error("API 요청 실패:", response);
        setTotalCount(0); // 기본 값 설정
        return;
      }
  
      const data = response.data;
      if (typeof data !== "number") {
        console.error("응답 데이터가 숫자가 아닙니다:", data);
        setTotalCount(0); // 기본 값 설정
        return;
      }
  
      setTotalCount(data);
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      setTotalCount(0); // 기본 값 설정
    }
  };

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
    fetchProductData(ticket.prodNumber); // 상품 데이터 가져오기
  };

  const closeModal = () => {
    setSelectedTicket(null); // 데이터 초기화
    setIsModalOpen(false); // 모달 닫기
    setTotalCount(null); // 추가 데이터 초기화
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
                  <td>{ticket.ticketCount}</td>
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
              <p>사용 시작 날짜: {new Date(selectedTicket.ticketStartDate).toLocaleDateString()}</p>
              <p>만료 날짜: {new Date(selectedTicket.ticketEndDate).toLocaleDateString()}</p>
              <p>결제 금액: {selectedTicket.ticketAmount.toLocaleString()}원</p>
              <p>
                사용 가능 횟수: {selectedTicket.ticketCount} / {totalCount || "불명"}
              </p>
              <button onClick={closeModal}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTicketList;
