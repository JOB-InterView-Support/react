import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./QnaList.module.css";
import Paging from "../../components/common/Paging";
import InsertButton from "../../components/common/button/InsertButton";

const QnaList = () => {
  const { isLoggedIn, isAuthInitialized, secureApiRequest, role } =
    useContext(AuthContext); // AuthContext에서 인증 상태와 API 요청 메서드 가져오기
  const navigate = useNavigate();

  const [qnaList, setQnaList] = useState([]); // QnA 목록 상태
  const [totalItems, setTotalItems] = useState(0); // 전체 QnA 아이템 개수 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const itemsPerPage = 10; // 한 페이지당 표시할 항목 수

  const userUuid = localStorage.getItem("uuid"); // localStorage에서 UUID 가져오기

  // 로그인 여부 확인
  useEffect(() => {
    if (isAuthInitialized && !isLoggedIn) {
      console.log("로그인되지 않은 상태입니다. 로그인 페이지로 이동합니다.");
      alert("로그인이 필요합니다."); // 알림창 표시wwww
      navigate("/login"); // 로그인되지 않은 경우 로그인 페이지로 이동
    }
  }, [isLoggedIn, isAuthInitialized, navigate]);

  // QnA 목록 데이터 가져오기
  const fetchQnaList = async (page = 1) => {
    if (!isLoggedIn) {
      navigate("/login"); // 로그인되지 않은 상태에서 요청 시도하면 로그인 페이지로 이동
      return;
    }

    setIsLoading(true); // 로딩 상태 시작
    setError(null); // 기존 에러 초기화

    try {
      console.log(`QnA 목록 요청 - 페이지: ${page}`);
      const response = await secureApiRequest(
        `/qna?page=${page}&size=${itemsPerPage}` // 서버 컨트롤러와 URL 형식을 맞춤
      );

      console.log("응답 데이터:", response.data);

      // 서버에서 받은 데이터를 그대로 사용
      setQnaList(response.data.list || []);
      setTotalItems(response.data.paging?.totalItems || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("QnA 목록 가져오기 실패:", err);
      setError("데이터를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
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
    <div className={styles.container}>
      <h1 className={styles.title}>QnA</h1>
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
                qnaList.map((qna, index) => {
                  const isSecret = qna.qisSecret === "Y"; // 비밀글 여부
                  const isAccessible =
                    role === "ADMIN" ||
                    qna.qwriter === userUuid ||
                    qna.uuid === userUuid; // 본인, 관리자 또는 UUID 일치 여부 확인

                  // 접근 가능 여부 확인
                  const canAccess = !isSecret || isAccessible;

                  return (
                    <tr
                      key={`${qna.qno}-${index}`} // 고유 키 설정
                      onClick={() => canAccess && handleDetailClick(qna.qno)} // 접근 가능한 경우만 클릭 허용
                      className={
                        !canAccess && isSecret ? styles.disabledRow : ""
                      }
                      style={{
                        cursor: canAccess ? "pointer" : "not-allowed",
                      }}
                    >
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>
                        {!canAccess && isSecret ? "비밀글입니다" : qna.qtitle}
                      </td>
                      <td>{!canAccess && isSecret ? "-" : qna.qwriter}</td>
                      <td>{new Date(qna.qWDate).toLocaleDateString()}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">데이터가 없습니다.</td>
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
          <InsertButton onClick={handleInsertClick} label="질문 등록" />{" "}
          {/* 질문 등록 버튼 */}
        </div>
      )}
    </div>
  );
};

export default QnaList;
