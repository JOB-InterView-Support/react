import React from 'react';
import styles from './JobPostingList.module.css'; // 스타일 파일 (CSS Module)

const JobPostingList = ({ postings }) => {
  return (
    <div className={styles.jobPostingList}>
      {postings.length > 0 ? (
        postings.map((posting) => (
          <div key={posting.id} className={styles.jobCard}>
            <h3>{posting.title}</h3>
            <p>{posting.company}</p>
            <p>{posting.location}</p>
            <p>{posting.jobType}</p>
            <button>상세보기</button>
          </div>
        ))
      ) : (
        <p>검색된 채용공고가 없습니다.</p>
      )}
    </div>
  );
};

export default JobPostingList;
