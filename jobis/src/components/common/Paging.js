import React from "react";
import styles from "./Paging.module.css";

function Paging({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 페이지 버튼 리스트 생성
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.pagingContainer}>
      {pages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? styles.active : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Paging;
