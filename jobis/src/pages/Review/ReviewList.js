import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import styles from './ReviewList.module.css';  //게시글 목록 출력 페이지에만 적용할 스타일시트 파일
import { useNavigate } from "react-router-dom";
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트

const ReviewList = () => {
    // AuthContext에서 인증 정보 및 API 요청 메서드 가져오기
    const { isLoggedIn, isAuthInitialized, secureApiRequest, role } = useContext(AuthContext);
    
    const [reviewList, setReviewList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // 페이지당 아이템 수 고정
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
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

  // 2. Review 목록 데이터를 서버에서 가져오는 함수
  const fetchReviewList = async (page = 1) => {
    // 로그인 상태가 아닐 경우 실행하지 않음
    if (!isLoggedIn) {
      return;
    }

    // 로딩 상태 활성화 및 이전 에러 초기화
    setIsLoading(true);
    setError(null);

    try {
      // 현재 페이지와 페이지 크기를 서버에 요청
      console.log("Review 목록 요청 - 페이지:", page);
      const response = await secureApiRequest(`/review`, {
        method: "GET",
        params: { page, size: itemsPerPage },
      });

      // 서버 응답 데이터 처리
      console.log("Review 목록 응답 데이터:", response.data);
      setReviewList(response.data.list || []); // Review 목록 저장
      setTotalItems(response.data.paging?.totalItems || 0); // 전체 아이템 수 저장
      setCurrentPage(page); // 현재 페이지 설정
    } catch (err) {
      console.error("Review 목록 가져오기 실패:", err);
      setError("데이터를 가져오는 중 문제가 발생했습니다."); // 에러 메시지 표시
    } finally {
      // 로딩 상태 비활성화
      setIsLoading(false);
    }
  };

  // 3. 컴포넌트가 마운트되거나 currentPage 변경 시 데이터를 가져옴
  useEffect(() => {
    if (isLoggedIn) {
      fetchReviewList(currentPage); // Review 목록 데이터를 요청
    }
  }, [isLoggedIn, currentPage]);

  // 4. "리뷰 등록" 버튼 클릭 시 등록 페이지로 이동
  const handleInsertClick = () => {
    navigate("/review/insert");
  };

  // 5. Review 테이블의 특정 행 클릭 시 상세 페이지로 이동
  const handleDetailClick = (rno) => {
    console.log("Navigating to:", `/review/detail/${rno}`);
    navigate(`/review/detail/${rno}`); // Review 번호를 경로로 전달
  };

  // 6. 에러가 발생한 경우 에러 메시지를 렌더링
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  // 7. Review 목록 렌더링
  return (
    <div className={styles["review-list-container"]}>
      <h1>Review 목록</h1>
      {isLoading ? (
        // 로딩 중일 때 메시지 표시
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
                // Review 데이터가 있을 경우 테이블에 행 생성
                reviewList.map((review, index) => (
                  <tr key={review.rno} onClick={() => handleDetailClick(review.rno)}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{review.rtitle}</td>
                    <td>{review.rwriter}</td>
                    <td>{new Date(review.rwdate).toLocaleDateString()}</td>
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
            onPageChange={(page) => fetchReviewList(page)} // 페이지 변경 시 실행
          />
        </>
      )}
      {role === "USER" && (
        // USER 권한일 경우만 "리뷰 등록" 버튼 표시
        <div className={styles.buttonContainer}>
        <InsertButton onClick={handleInsertClick} label="리뷰 등록"/>
      </div>
      )}
    </div>
  );
};


export default ReviewList;