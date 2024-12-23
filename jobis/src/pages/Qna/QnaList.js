import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import styles from "./QnaList.module.css";
import { useNavigate } from "react-router-dom";
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트

const QnaList = () => {
  const { isLoggedIn, isAuthInitialized, secureApiRequest } = useContext(AuthContext);
  const [qnaList, setQnaList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 페이지당 아이템 수 고정
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchQnaList = async (page = 1) => {
    if (!isAuthInitialized || !isLoggedIn) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("QnA 목록 요청 - 페이지:", page);
      const response = await secureApiRequest(`/qna`, {
        method: "GET",
        params: { page, size: itemsPerPage },
      });
      console.log("QnA 목록 응답 데이터:", response.data);

      setQnaList(response.data.list || []);
      setTotalItems(response.data.paging.totalItems || 0);
      setCurrentPage(page); // 현재 페이지 설정
    } catch (err) {
      console.error("QnA 목록 가져오기 실패:", err);
      setError(err.response?.data?.message || "데이터를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQnaList(currentPage);
  }, [isLoggedIn, isAuthInitialized]);

  const handleInsertClick = () => {
    navigate("/qna/insert"); // 등록 페이지로 이동
  };

  if (error) {
    return <p className={styles.error}>오류 발생: {error}</p>;
  }

  return (
    <div className={styles["qna-list-container"]}>
      <h1>QnA 목록</h1>
      {isLoading ? (
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
                qnaList.map((qna, index) => (
                  <tr key={qna.qno}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{qna.qtitle}</td>
                    <td>{qna.qwriter}</td>
                    <td>{new Date(qna.qwdate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* 페이징 컴포넌트 추가 */}
          <Paging
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => fetchQnaList(page)}
          />
        </>
      )}
      {isLoggedIn && (
    <div className={styles.buttonContainer}>
      <InsertButton onClick={handleInsertClick} label="질문 등록" />
    </div>
  )}
    </div>
    
  );
};

export default QnaList;
