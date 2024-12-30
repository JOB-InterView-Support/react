import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeList.module.css"; // CSS Modules
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트

function NoticeList() {
  const { isLoggedIn, isAuthInitialized, secureApiRequest, role } = useContext(AuthContext);
  const [noticeList, setnoticeList] = useState([]); // 공지사항 리스트 상태
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
    setIsLoading(true); // 로딩 시작
    setError(null); // 에러 초기화

    console.log(`Fetching notices for page: ${page}`); // 현재 페이지 로그

    try {
      const response = await secureApiRequest(`/notice`, {
        method: "GET",
        params: { page, size: itemsPerPage },
      });

      console.log("API response data:", response.data); // API 응답 로그
      setnoticeList(response.data.list || []); // 공지사항 리스트 업데이트
      setTotalItems(response.data.paging.totalItems || 0); // 전체 아이템 수 업데이트
      setCurrentPage(page); // 현재 페이지 업데이트
      console.log("Updated notice list:", response.data.list); // 업데이트된 리스트 로그
    } catch (err) {
      console.error("Failed to fetch notice list:", err); // 에러 로그
      setError("데이터 전송 실패"); // 에러 상태 설정
    } finally {
      setIsLoading(false); // 로딩 종료
      console.log("Loading finished for page:", page); // 로딩 완료 로그
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

  // 로딩 상태 및 공지사항 리스트 상태 출력
  console.log("isLoading:", isLoading);
  console.log("Current notice list:", noticeList);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className={styles.noticecontainer}>
      <h2 className={styles.noticetitle}>공지사항</h2>
      <table className={styles.noticetable}>
        <tbody>
          {noticeList.map((notice) => (
            <tr key={notice.noticeNo}>
              <td>
                <button
                  onClick={() => handleMoveDetail(notice.noticeNo)}
                  className={styles.noticeTbutton}
                >
                  {notice.noticeTitle}
                </button>
              </td>
              <td>{formatDate(notice.noticeWDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paging
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => {// 페이지 변경 시 호출
        fetchNoticeList(page);}}
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
