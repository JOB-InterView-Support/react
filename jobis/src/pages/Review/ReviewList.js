import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import styles from './ReviewList.module.css';  //게시글 목록 출력 페이지에만 적용할 스타일시트 파일
import { useNavigate } from "react-router-dom";
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트

const ReviewList = () => {
    const { isLoggedIn, isAuthInitialized, secureApiRequest, role } = useContext(AuthContext);
    const [reviewList, setReviewList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // 페이지당 아이템 수 고정
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    // 로그인 상태 확인 후 리다이렉트 처리
    useEffect(() => {
      if (!isLoggedIn) {
        navigate("/login"); // 로그인 페이지로 이동
      }
    }, [isLoggedIn,  navigate]);
  
    const fetchReviewList = async (page = 1) => {
      if (!isLoggedIn) {
        return; // 로그인 상태가 아닐 때 실행하지 않음
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        console.log("Review 목록 요청 - 페이지:", page);
        const response = await secureApiRequest(`/review`, {
          method: "GET",
          params: { page, size: itemsPerPage },
        });
        console.log("Review 목록 응답 데이터:", response.data);
  
        setReviewList(response.data.list || []);
        setTotalItems(response.data.paging.totalItems || 0);
        setCurrentPage(page); // 현재 페이지 설정
      } catch (err) {
        console.error("Review 목록 가져오기 실패:", err);
        setError("데이터를 가져오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchReviewList(currentPage);
    }, [isLoggedIn]);
  
    const handleInsertClick = () => {
      navigate("/review/insert"); // 등록 페이지로 이동
    };
  
  
    if (error) {
      return <p className={styles.error}>{error}</p>;
    }
  
    return (
      <div className={styles["review-list-container"]}>
        <h1>Review 목록</h1>
        {isLoading ? (
          <p>데이터를 불러오는 중입니다...</p>
        ) : (
          <>
            <table className={styles["review-table"]}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {reviewList.length > 0 ? (
                  reviewList.map((review, index) => (
                    <tr key={review.rno}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>{review.rtitle}</td>
                      <td>{review.rwriter}</td>
                      <td>{new Date(review.rwdate).toLocaleDateString()}</td>
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
              onPageChange={(page) => fetchReviewList(page)}
            />
          </>
        )}
        {role === "USER" && (
          <div className={styles.buttonContainer}>
            <InsertButton onClick={handleInsertClick} label="질문 등록" />
          </div>
        )}
      </div>
    );
  };
  

export default ReviewList;