import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import styles from "./QnaList.module.css"; // CSS 모듈 스타일링
import { useNavigate } from "react-router-dom"; // React Router를 사용한 페이지 이동
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트

const QnaList = () => {
  // AuthContext에서 인증 정보 및 API 요청 메서드 가져오기
  const { isLoggedIn, isAuthInitialized, secureApiRequest, role } = useContext(AuthContext);

  // 컴포넌트의 상태 관리
  const [qnaList, setQnaList] = useState([]); // QnA 목록을 저장
  const [totalItems, setTotalItems] = useState(0); // 전체 QnA 아이템 수 저장
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [itemsPerPage] = useState(10); // 한 페이지에 표시할 아이템 수
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 메시지 저장
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 함수

  // 1. 로그인 상태 확인 후 미로그인 시 /login으로 리다이렉트
  useEffect(() => {
    // 인증 상태 초기화 완료 후 확인
    if (isAuthInitialized) {
      if (!isLoggedIn) {
        console.log("로그인되지 않은 상태입니다. 로그인 페이지로 이동합니다.");
        navigate("/login"); // 로그인 페이지로 리다이렉트
      }
    }
  }, [isLoggedIn, isAuthInitialized, navigate]);

  // 2. QnA 목록 데이터를 서버에서 가져오는 함수
  const fetchQnaList = async (page = 1) => {
    // 로그인 상태가 아닐 경우 실행하지 않음
    if (!isLoggedIn) {
      return;
    }

    // 로딩 상태 활성화 및 이전 에러 초기화
    setIsLoading(true);
    setError(null);

    try {
      // 현재 페이지와 페이지 크기를 서버에 요청
      console.log("QnA 목록 요청 - 페이지:", page);
      const response = await secureApiRequest(`/qna`, {
        method: "GET",
        params: { page, size: itemsPerPage },
      });

      // 서버 응답 데이터 처리
      console.log("QnA 목록 응답 데이터:", response.data);
      setQnaList(response.data.list || []); // QnA 목록 저장
      setTotalItems(response.data.paging?.totalItems || 0); // 전체 아이템 수 저장
      setCurrentPage(page); // 현재 페이지 설정
    } catch (err) {
      console.error("QnA 목록 가져오기 실패:", err);
      setError("데이터를 가져오는 중 문제가 발생했습니다."); // 에러 메시지 표시
    } finally {
      // 로딩 상태 비활성화
      setIsLoading(false);
    }
  };

  // 3. 컴포넌트가 마운트되거나 currentPage 변경 시 데이터를 가져옴
  useEffect(() => {
    if (isLoggedIn) {
      fetchQnaList(currentPage); // QnA 목록 데이터를 요청
    }
  }, [isLoggedIn, currentPage]);

  // 4. "질문 등록" 버튼 클릭 시 등록 페이지로 이동
  const handleInsertClick = () => {
    navigate("/qna/insert");
  };

  // 5. QnA 테이블의 특정 행 클릭 시 상세 페이지로 이동
  const handleDetailClick = (qNo) => {
    console.log("Navigating to:", `/qna/detail/${qNo}`);
    navigate(`/qna/detail/${qNo}`); // QnA 번호를 경로로 전달
  };

  // 6. 에러가 발생한 경우 에러 메시지를 렌더링
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  // 7. QnA 목록 렌더링
  return (
    <div className={styles["qna-list-container"]}>
      <h1>QnA 목록</h1>
      {isLoading ? (
        // 로딩 중일 때 메시지 표시
        <p>데이터를 불러오는 중입니다...</p>
      ) : (
        <>
          <table className={styles["qna-table"]}>
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {qnaList.length > 0 ? (
                // QnA 데이터가 있을 경우 테이블에 행 생성
                qnaList.map((qna, index) => (
                  <tr key={qna.qno} onClick={() => handleDetailClick(qna.qno)}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{qna.qtitle}</td>
                    <td>{qna.qwriter}</td>
                    <td>{new Date(qna.qwdate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                // 데이터가 없을 경우 사용자에게 안내 메시지 표시
                <tr>
                  <td colSpan="4">데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* 페이징 컴포넌트 */}
          <Paging
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => fetchQnaList(page)} // 페이지 변경 시 실행
          />
        </>
      )}
      {role === "USER" && (
        // USER 권한일 경우만 "질문 등록" 버튼 표시
        <div className={styles.buttonContainer}>
          <InsertButton onClick={handleInsertClick} label="질문 등록" />
        </div>
      )}
    </div>
  );
};

export default QnaList;
