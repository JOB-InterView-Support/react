import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./JobPostingSubMenubar.module.css";

function JobPostingSubMenubar() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <Link to="/jobPosting" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/jobPosting" ? styles.active : ""}`}>
          채용공고
        </div>
      </Link>

      <Link to="/favorites/search" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/favorites/search" ? styles.active : ""}`}>
          즐겨찾기
        </div>
      </Link>
    </div>
  );
}

export default JobPostingSubMenubar;