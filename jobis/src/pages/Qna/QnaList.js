import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import styles from "./QnaList.module.css";
import { useNavigate } from "react-router-dom";

const QnaList = () => {
  const { isLoggedIn, isAuthInitialized, secureApiRequest } = useContext(AuthContext);
  const [qnaList, setQnaList] = useState([]);
  const [paging, setPaging] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // QnA 목록 가져오기
  const fetchQnaList = async (page = 1) => {
    if (!isAuthInitialized) {
      console.warn("인증 상태 초기화 중입니다. 데이터 요청을 건너뜁니다.");
      return;
    }

    if (!isLoggedIn) {
      console.warn("로그인되지 않았습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("QnA 목록 요청 - 페이지:", page);
      const response = await secureApiRequest(`/qna`, {
        method: "GET",
        params: { page, size: 10 },
      });
      console.log("QnA 목록 응답 데이터:", response.data);

      setQnaList(response.data.list || []);
      setPaging(response.data.paging || {});
      setCurrentPage(page);
    } catch (err) {
      console.error("QnA 목록 가져오기 실패:", err);
      setError(err.response?.data?.message || "데이터를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchQnaList();
  }, [isLoggedIn, isAuthInitialized]);

  if (!isAuthInitialized) {
    return <p>인증 상태 초기화 중입니다...</p>;
  }

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
                  <tr key={qna.qNo}>
                    <td>{index + 1 + (currentPage - 1) * 10}</td>
                    <td>{qna.qTitle}</td>
                    <td>{qna.qWriter}</td>
                    <td>{new Date(qna.qWDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* 페이징 처리 */}
          <div className={styles.pagination}>
            {Array.from({ length: paging.maxPage || 1 }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                className={page === currentPage ? styles.active : ""}
                onClick={() => fetchQnaList(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default QnaList;
