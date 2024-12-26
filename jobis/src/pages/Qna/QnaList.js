import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./QnaList.module.css";
import Paging from "../../components/common/Paging";
import InsertButton from "../../components/common/button/InsertButton";

const QnaList = () => {
  const { isLoggedIn, isAuthInitialized, secureApiRequest, role } = useContext(AuthContext); // AuthContext에서 인증 상태와 API 요청 메서드 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅

  const [qnaList, setQnaList] = useState([]); // QnA 목록 상태
  const [totalItems, setTotalItems] = useState(0); // 전체 QnA 아이템 개수 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const itemsPerPage = 10; // 한 페이지당 표시할 항목 수

  // 로그인 여부 확인
  useEffect(() => {
    if (isAuthInitialized && !isLoggedIn) {
      console.log("로그인되지 않은 상태입니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인되지 않은 경우 로그인 페이지로 이동
    }
  }, [isLoggedIn, isAuthInitialized, navigate]);

  // QnA 목록 데이터 가져오기
  const fetchQnaList = async (page = 1) => {
    if (!isLoggedIn) {
      return; // 로그인되지 않은 상태에서는 데이터 요청 안 함
    }

    setIsLoading(true); // 로딩 상태 시작
    setError(null); // 기존 에러 초기화

    try {
      console.log(`QnA 목록 요청 - 페이지: ${page}`);
      const response = await secureApiRequest(
        `/qna?page=${page}&size=${itemsPerPage}` // 서버 컨트롤러와 URL 형식을 맞춤
      );

      console.log("응답 데이터:", response.data);

      setQnaList(response.data.list || []); // 서버에서 받은 QnA 목록을 상태에 저장
      setTotalItems(response.data.paging?.totalItems || 0); // 전체 항목 개수를 상태에 저장
      setCurrentPage(page); // 현재 페이지 상태 업데이트
    } catch (err) {
      console.error("QnA 목록 가져오기 실패:", err);
      setError("데이터를 가져오는 중 문제가 발생했습니다."); // 에러 메시지 설정
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchQnaList(currentPage); // 현재 페이지에 맞는 데이터를 로드
  }, [currentPage]);

  const handleInsertClick = () => {
    navigate("/qna/insert"); // 질문 등록 페이지로 이동
  };

  const handleDetailClick = (qNo) => {
    console.log("Navigating to:", `/qna/detail/${qNo}`);
    navigate(`/qna/detail/${qNo}`); // 상세 페이지로 이동
  };

  if (error) {
    return <p className={styles.error}>{error}</p>; // 에러가 발생했을 경우 에러 메시지 표시
  }

  return (
    <div className={styles["qna-list-container"]}>
      <h1>QnA 목록</h1>
      {isLoading ? (
        <p>데이터를 불러오는 중입니다...</p> // 로딩 중일 때 표시
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
                qnaList.map((qna, index) => (
                  <tr
                    key={`${qna.uuid}-${index}`} // 중복 키 방지: uuid와 index를 조합하여 고유 키 생성
                    onClick={() => handleDetailClick(qna.uuid)}
                  >
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td> {/* 페이지에 따른 항목 번호 계산 */}
                    <td>{qna.qtitle}</td> {/* 제목 표시 */}
                    <td>{qna.qwriter}</td> {/* 작성자 표시 */}
                    <td>{new Date(qna.qWDate).toLocaleDateString()}</td> {/* 작성일 표시 */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">데이터가 없습니다.</td> {/* 데이터가 없을 경우 메시지 표시 */}
                </tr>
              )}
            </tbody>
          </table>
          <Paging
            totalItems={totalItems} // 전체 항목 수 전달
            itemsPerPage={itemsPerPage} // 페이지당 항목 수 전달
            currentPage={currentPage} // 현재 페이지 전달
            onPageChange={(page) => setCurrentPage(page)} // 페이지 변경 시 상태 업데이트
          />
        </>
      )}
      {role === "USER" && (
        <div className={styles.buttonContainer}>
          <InsertButton onClick={handleInsertClick} label="질문 등록" /> {/* 질문 등록 버튼 */}
        </div>
      )}
    </div>
  );
};

export default QnaList;
