import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import logo from "../../assets/images/logo.png"; // 로고 이미지
import styles from "./Header.module.css"; // CSS Modules
import axios from "axios";

function Header() {
  const { secureApiRequest } = useContext(AuthContext);
  const navigate = useNavigate();

  // 로컬스토리지에서 로그인 정보 가져오기
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");
  const role = localStorage.getItem("role"); // 역할 정보 가져오기
  const isLoggedIn = !!accessToken;
  const isAdmin = role === "ADMIN"; // 관리자 여부 확인

  const [ticketCount, setTicketCount] = useState(null); // TICKET_COUNT 상태

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // 서버에 로그아웃 요청
      await axios.post("http://localhost:8080/logout", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      // 로컬 스토리지에서 모든 데이터 제거
      localStorage.clear();
      alert("로그아웃 되었습니다.");
      navigate("/"); // 로그아웃 후 메인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error.response?.data || error.message);
      alert(
        "로그아웃 요청이 실패했지만 데이터를 정리하고 메인 페이지로 이동합니다."
      );
      localStorage.clear();
      navigate("/"); // 메인 페이지로 이동
    }
  };

  const handleMyPage = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다."); // 로그인 필요 알림
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      navigate("/updateUser"); // 마이페이지로 이동
    }
  };

  // TICKET_COUNT 가져오기
  useEffect(() => {
    let intervalId;

    const fetchTicketCount = async () => {
      if (isLoggedIn) {
        try {
          const ticketResponse = await secureApiRequest("/ticket/check", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("Ticket API 응답:", ticketResponse.data); // 응답 확인
          const ticketData = ticketResponse.data;

          // 배열에서 남은 이용권 개수 추출
          const count = Array.isArray(ticketData.ticketCounts) && ticketData.ticketCounts.length > 0
            ? ticketData.ticketCounts[0]
            : 0;

          setTicketCount(count); // 남은 이용권 수 업데이트
        } catch (error) {
          console.error("이용권 정보 가져오기 실패:", error.message);
          setTicketCount(0); // 오류 시 기본값 0
        }
      }
    };

    fetchTicketCount();

    // 5초마다 갱신
    intervalId = setInterval(fetchTicketCount, 5000);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 타이머 제거
  }, [isLoggedIn, secureApiRequest]);

  return (
    <header className={styles.header}>
      <div>
        <Link to="/">
          <img src={logo} alt="Site Logo" className={styles.logo} />
        </Link>
      </div>
      <nav>
        <ul className={styles.navList}>
          <li>
            <Link to="/notice" className={styles.noLink}>
              공지사항
            </Link>
          </li>
          <li>
            <Link to="/selectintro" className={styles.noLink}>
              AI 모의면접
            </Link>
          </li>
          <li>
            <Link to="/jobPosting" className={styles.noLink}>
              채용공고
            </Link>
          </li>
          <li>
            <Link to="/review" className={styles.noLink}>
              체험 후기
            </Link>
          </li>
          <li>
            <Link to="/qna" className={styles.noLink}>
              Q&A
            </Link>
          </li>
          <li>
            <Link to="/ticketList" className={styles.noLink}>
              이용권
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.rightBtn}>
        {isLoggedIn ? (
          <>
            <div className={styles.top}>{userName}님 환영합니다.</div>
            <div className={styles.bottom}>
              <button onClick={handleMyPage}>마이페이지</button>
              <button onClick={handleLogout}>로그아웃</button>
            </div>
            <div className={styles.ticketInfo}>
              남은 이용권: <strong>{ticketCount}</strong>
            </div>
          </>
        ) : (
          <div className={styles.bottom}>
            <button>
              <Link to="/login">로그인</Link>
            </button>
          </div>
        )}
        {isAdmin && (
          <div>
            <Link to="/adminMemberManagement">
              <button>관리자페이지</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
