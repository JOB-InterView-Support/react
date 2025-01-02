import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from './TicketInfo.module.css';



function TicketInfo (){
    const { isLoggedIn, isAuthInitialized, secureApiRequest, role } = useContext(AuthContext);
    const [ticketList, setTicketList] = useState([]); // 이용권 리스트 상태
    const [totalItems, setTotalItems] = useState(0); // 전체 아이템 수 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태 관리

    const navigate = useNavigate();

    const fetchTicketList = async (page = 1) => {
        setIsLoading(true);
        setError(null);
      
        try {
          const response = await secureApiRequest(`/ticket?page=${page}&size=10`, {
            method: "GET",
          });
      
          // 서버 응답 데이터 확인
          console.log("API 응답 데이터:", response.data);
      
          const filteredList = response.data.list.filter(); // 필터링
          setTicketList(filteredList);
          setTotalItems(response.data.paging.totalItems);
          setCurrentPage(page);
        } catch (err) {
          console.error("이용권 목록 로드 실패:", err);
          setError("데이터를 불러오는 중 문제가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      };

       useEffect(() => {
          if (!isAuthInitialized && !isLoggedIn) {
            console.log("로그인되지 않은 상태입니다. 로그인 페이지로 이동합니다.");
            navigate("/login");
          } else {
            fetchTicketList(currentPage); // 로그인 상태이면 이용권 목록 가져오기
          }
        }, [isLoggedIn, isAuthInitialized, navigate]);

    const tickets = [
       { name: "(6개월) 5+1회 이용권", price: "47000 원", date: "2024.11.01", cancelable: true },
       { name: "(24시간) 1회 이용권", price: "9900 원", date: "2024.10.28", cancelable: false },
       { name: "(24시간) 1회 이용권", price: "9900 원", date: "2024.10.28", cancelable: false },
     ];


    return(
    <div className={styles.container}>
        <h1 className={styles.header}>이용권 조회</h1>
        <table className={styles.table}>
            <thead>
            <tr>
                <th className={styles.tTName}>이용권 이름</th>
                <th className={styles.tTh}>금액</th>
                <th className={styles.tTh}>구매 날짜</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {tickets.map((ticket, index) => (
                <tr key={index}>
                <td className={styles.tName}>{ticket.name}</td>
                <td className={styles.tPrice}>{ticket.price}</td>
                <td className={styles.tDate}>{ticket.date}</td>
                <td>{ticket.cancelable && (
                        <span><button className={styles.cancelButton}>환불</button></span>
                    )}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    );
}

export default TicketInfo;