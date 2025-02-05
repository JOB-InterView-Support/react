import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import apiClient from "../../utils/axios";
import styles from "./MyTicketList.module.css";
import { Navigate, useNavigate } from "react-router-dom";

function MyTicketList() {
  const { secureApiRequest } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]); // 티켓 리스트
  const [selectedTicket, setSelectedTicket] = useState(null); // 선택된 티켓 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchTickets = async () => {
      const storedUuid = localStorage.getItem("uuid");

      if (!storedUuid) {
        console.error("로컬 스토리지에 UUID가 없습니다.");
        return;
      }

      try {
        const response = await secureApiRequest(
          `/mypage/ticket/${storedUuid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
      if (selectedTicket.ticketCount === selectedTicket.prodNumberOfTime) {
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
          setSelectedTicket(null);
          setIsModalOpen(false);
          navigate("/MyTicketList");
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

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <h2 className={styles.subTitle}>이용권 내역</h2>
        {tickets.length === 0 ? (
          <p className={styles.noTickets}>
            이용권 구매 내역이 존재하지 않습니다.
          </p>
        ) : (
          <table className={styles["ticketTable"]}>
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
                <tr
                  key={ticket.ticketKey}
                  className={styles.ticketRow} // CSS 클래스 추가 확인
                  onClick={() => openModal(ticket)}
                >
                  <td>{ticket.ticketName}</td>
                  <td>
                    {ticket.ticketCount} / {ticket.prodNumberOfTime || "불명"}
                  </td>
                  <td>{ticket.ticketAmount.toLocaleString()}원</td>
                  <td>
                    {new Date(ticket.ticketStartDate).toLocaleDateString()}
                  </td>
                  <td>{new Date(ticket.ticketEndDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isModalOpen && selectedTicket && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>이용권 정보</h3>
              <div className={styles.modalBody}>
                <p>이용권 이름: {selectedTicket.ticketName}</p>
                <p>
                  사용 시작 날짜:{" "}
                  {new Date(
                    selectedTicket.ticketStartDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  만료 날짜:{" "}
                  {new Date(selectedTicket.ticketEndDate).toLocaleDateString()}
                </p>
                <p>
                  결제 금액: {selectedTicket.ticketAmount.toLocaleString()}원
                </p>
                <p>
                  사용 가능 횟수: {selectedTicket.ticketCount} /{" "}
                  {selectedTicket.prodNumberOfTime || "불명"}
                </p>
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.refundButton}
                  onClick={() => handleRefund(selectedTicket.paymentKey)} // paymentKey 전달
                >
                  환불하기
                </button>
                <button onClick={closeModal} className={styles.closeButton}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTicketList;
