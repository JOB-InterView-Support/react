import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeList.module.css"; // CSS Modules
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트

function NoticeList() {
  const { isLoggedIn, isAuthInitialized, secureApiRequest, role } =
    useContext(AuthContext);
  const [noticeList, setNoticeList] = useState([]); // 공지사항 리스트 상태
  const [totalItems, setTotalItems] = useState(0); // 전체 아이템 수 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태 관리

  const navigate = useNavigate();
  const itemsPerPage = 10; // 한 페이지에 보여줄 아이템 수

  const handleMoveDetail = (no) => {
    navigate(`/notice/detail/${no}`); // 공지사항 상세보기 페이지로 이동
  };

  const fetchNoticeList = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await secureApiRequest(`/notice?page=${page}&size=10`, {
        method: "GET",
      });

      // 서버 응답 데이터 확인
      console.log("API 응답 데이터:", response.data);

      const filteredList = response.data.list.filter(
        (notice) => notice.noticeIsDeleted === "N"
      ); // 필터링
      setNoticeList(filteredList);
      setTotalItems(response.data.paging.totalItems);
      setCurrentPage(page);
    } catch (err) {
      console.error("공지사항 목록 로드 실패:", err);
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveInsert = () => {
    navigate(`/notice/insert`); // 공지사항 등록 페이지로 이동
    console.log("Navigating to insert page"); // 이동 로그
  };

  useEffect(() => {
    if (!isAuthInitialized && !isLoggedIn) {
      console.log("로그인되지 않은 상태입니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } else {
      fetchNoticeList(currentPage); // 로그인 상태이면 공지사항 목록 가져오기
    }
  }, [isLoggedIn, isAuthInitialized, navigate]);

  const handlePageChange = (page) => {
    console.log(`Page changed to: ${page}`); // 페이지 변경 로그
    fetchNoticeList(page); // 페이지 변경 시 데이터 가져오기
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 0부터 시작하므로 1 추가
    const day = date.getUTCDate();
    return `${year}. ${month}. ${day}.`; // yyyy. m. d. 형식으로 반환
  }

  return (
    <div className={styles.noticecontainer}>
      <h2 className={styles.noticetitle}>공지사항</h2>
      {error && <div className={styles.errorMessage}>{error}</div>} {/* 에러 메시지 표시 */}
      {isLoading && (
        <div className={styles.loadingMessage}>로딩 중...</div>
      )} {/* 로딩 상태 표시 */}
      <table className={styles.noticetable}>
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {noticeList.map((notice, index) => (
            <tr
              key={notice.noticeNo}
              onClick={() => handleMoveDetail(notice.noticeNo)}
              className={styles.noticerow}
            >
              <td>{totalItems - (index + (currentPage - 1) * itemsPerPage)}</td>
              <td>{notice.noticeTitle}</td>
              <td>{formatDate(notice.noticeWDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paging
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange} // 페이지 변경 시 호출
      />
      {role === "ADMIN" && (
        <div className={styles.buttonContainer}>
          <InsertButton onClick={handleMoveInsert} label="공지 등록" />
        </div>
      )}
    </div>
  );
}

export default NoticeList;
