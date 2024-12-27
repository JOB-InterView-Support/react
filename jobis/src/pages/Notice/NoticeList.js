import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeList.module.css"; // CSS Modules
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
//import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트

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
    // 공지사항 상세보기 페이지로 이동
    navigate(`/notice/detail/${no}`);
  };

  const fetchNoticeList = async (page = 1) => {
    // 공지사항 목록을 가져오는 함수
    setIsLoading(true); // 로딩 시작
    setError(null); // 에러 초기화

    try {
      const response = await secureApiRequest(`/notice`, {
        method: "GET",
        params: { page, size: itemsPerPage },
      });

      // 응답 받은 데이터를 콘솔에 출력
      console.log("response : " + JSON.stringify(response.data.list));

      setnoticeList(response.data.list || []); // 공지사항 리스트 상태 업데이트
      setTotalItems(response.data.paging.totalItems || 0); // 전체 아이템 수 업데이트
      setCurrentPage(page); // 현재 페이지 상태 업데이트
    } catch {
      setError("데이터 전송 실패"); // 에러 발생 시 에러 메시지 설정
    } finally {
      // 로딩 종료
      setIsLoading(false);
    }
  };

  const handleMoveInsert = () => {
    // 공지사항 등록 페이지로 이동
    navigate(`/notice/insert`);
    console.log("handleMoveInsert : " + JSON.stringify(handleMoveInsert.data)); 
    // 버튼 클릭 시 handleMoveInsert의 데이터를 콘솔에 찍음 (이 부분은 동작하지 않음)
  };

  useEffect(() => {
      if (!isAuthInitialized && !isLoggedIn) {
        console.log("로그인되지 않은 상태입니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } else {
      fetchNoticeList(currentPage); // 로그인 상태이면 공지사항 목록을 가져옴
    }
  }, [isLoggedIn, isAuthInitialized, navigate]);

  // 로딩 상태 및 공지사항 리스트 상태 출력
  console.log("isLoading:", isLoading);
  console.log("noticeList:", noticeList);

  return (
    <div className={styles.noticecontainer}>
      <h2 className={styles.noticetitle}>공지사항</h2>
      <table className={styles.noticetable}>
        <tbody>
          {noticeList.map((notice) => (
            <tr key={notice.noticeNo}>
              <td>
                <button onClick={() => handleMoveDetail(notice.noticeNo)} className={styles.noticeTbutton}>
                  {notice.noticeTitle}
                </button>
              </td>
              <td>{notice.noticeWDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paging
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => fetchNoticeList(page)} // 페이지 변경 시 공지사항 목록을 새로 가져옴
      />
      {role === "ADMIN" && (
        // ADMIN 역할인 경우에만 등록 버튼 표시
        <div className={styles.buttonContainer}>
          <button onClick={handleMoveInsert}>등 록</button>
        </div>
      )}
    </div>
  );
}
export default NoticeList;
