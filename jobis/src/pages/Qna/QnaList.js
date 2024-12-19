// src/pages/qna/QnaList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QnaList.module.css';
import Paging from '../../components/common/Paging';

function QnaList() {
  const navigate = useNavigate();

  // 제목 클릭 시 상세 페이지로 이동하는 함수
  const handleTitleClick = (qnaId) => {
    navigate(`/qna/detail/${qnaId}`); // qnaId에 해당하는 상세 페이지로 이동
  };

  // 질문 등록 버튼 클릭 시 등록 페이지로 이동하는 함수
  const handleWriteClick = () => {
    navigate('/qna/write'); // 질문 등록 페이지로 이동
  };

  return (
    <div className={styles.qnaContainer}>
      <h1 className={styles.title}>Q&A 게시판</h1>
      {/* 질문 등록 버튼 */}
      <button onClick={handleWriteClick}>질문 등록</button>
      
      {/* Q&A 목록 테이블 */}
      <table className={styles.qnaList}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {/* 샘플 데이터 출력 */}
          {[1, 2, 3, 4, 5].map((id) => (
            <tr key={id}>
              <td>{id}</td>
              <td>
                {/* 제목 클릭 시 이동 처리 */}
                <span
                  style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => handleTitleClick(id)}
                >
                  샘플 제목 {id}
                </span>
              </td>
              <td>작성자 {id}</td>
              <td>2024-12-19</td>
              <td>{id * 10}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 페이징 컴포넌트 */}
      <Paging 
        currentPage={1} // 현재 페이지 번호
        maxPage={5} // 최대 페이지 번호
        startPage={1} // 시작 페이지 번호
        endPage={5} // 끝 페이지 번호
        onPageChange={(page) => console.log(`페이지 이동: ${page}`)} // 페이지 변경 핸들러
      />
    </div>
  );
}

export default QnaList;
