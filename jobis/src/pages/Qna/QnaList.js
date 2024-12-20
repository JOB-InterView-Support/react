import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  // 페이지 이동을 위한 react-router-dom 사용
import { AuthProvider } from '../../AuthProvider';
import styles from './QnaList.module.css';  // 게시글 목록 스타일 정의
import PagingView from '../../components/common/Paging';  // 페이징 컴포넌트 가져오기
import { AuthContext } from '../../AuthProvider';

function QnaList() {
  const [qnaData, setQnaData] = useState([]); // Q&A 데이터를 저장하는 상태
  const [pagingInfo, setPagingInfo] = useState({
    currentPage: 1, // 현재 페이지
    maxPage: 1, // 최대 페이지 수
    startPage: 1, // 시작 페이지 번호
    endPage: 1, // 끝 페이지 번호
  });

  const [isSearchMode, setIsSearchMode] = useState(false); // 검색 모드 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리

  const { isLoggedIn } = useContext(AuthContext);  // 사용자 로그인 상태 가져오기

  const navigate = useNavigate();  // 페이지 이동 함수 정의

  // Q&A 데이터를 가져오는 함수
  const fetchQnaData = async (page) => {
    try {
      setLoading(true); // 로딩 시작
      console.log(`Fetching Q&A data for page: ${page}`); // 현재 페이지 로그 출력
      const response = await AuthProvider.get(`/qna`, {
        params: { page },
      }); // API 호출
      console.log('Fetched data:', response.data); // 가져온 데이터 로그 출력
      setQnaData(response.data.list); // 데이터 설정
      setPagingInfo(response.data.paging); // 페이징 정보 설정
      setIsSearchMode(false); // 일반 모드로 전환
    } catch (err) {
      console.error('Error fetching Q&A data:', err); // 에러 로그 출력
      setError('게시글 목록을 불러오는 데 실패했습니다.'); // 에러 메시지 설정
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 페이지 변경 처리 함수
  const handlePageChange = async (page) => {
    try {
      console.log(`Changing to page: ${page}`); // 페이지 변경 로그 출력
      await fetchQnaData(page); // 데이터 가져오기
    } catch (error) {
      console.error('Error during page change:', error); // 에러 로그 출력
      setError('페이징 요청 실패!');
    }
  };

  // 목록 초기화 및 일반 조회 전환
  const handleListButtonClick = () => {
    console.log('Returning to default list view'); // 일반 조회 모드 로그 출력
    setIsSearchMode(false);
    fetchQnaData(1); // 첫 페이지 데이터 가져오기
  };

  // 제목 클릭 시 상세보기로 이동
  const handleTitleClick = (qnaNo) => {
    console.log(`Navigating to detail view for QnA No: ${qnaNo}`); // 상세보기 이동 로그 출력
    navigate(`/qna/detail/${qnaNo}`); // 상세보기 페이지로 이동
  };

  // 글쓰기 버튼 클릭 시 글쓰기 페이지로 이동
  const handleWriteClick = () => {
    console.log('Navigating to write page'); // 글쓰기 이동 로그 출력
    navigate('/board/write'); // 글쓰기 페이지로 이동
  };

  // 로딩 중 상태 처리
  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>; // 로딩 메시지 표시
  }

  // 에러 상태 처리
  if (error) {
    return <div className={styles.error}>{error}</div>; // 에러 메시지 표시
  }

  // Q&A 목록 화면 반환
  return (
    <div className={styles.qnaListContainer}>
      <h1>질문과 답변 목록</h1>
      <button className={styles.writeButton} onClick={handleWriteClick}>글쓰기</button> {/* 글쓰기 버튼 */}
      <table className={styles.qnaTable}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {qnaData.map((qna) => (
            <tr key={qna.qNo}>
              <td>{qna.qNo}</td>
              <td className={styles.qnaTitle} onClick={() => handleTitleClick(qna.qNo)}>{qna.qTitle}</td> {/* 제목 클릭 처리 */}
              <td>{qna.qWriter}</td>
              <td>{qna.qWDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PagingView
        currentPage={pagingInfo.currentPage} // 현재 페이지
        maxPage={pagingInfo.maxPage} // 최대 페이지
        startPage={pagingInfo.startPage} // 시작 페이지
        endPage={pagingInfo.endPage} // 끝 페이지
        onPageChange={handlePageChange} // 페이지 변경 처리 함수
      />
    </div>
  );
}

export default QnaList;
