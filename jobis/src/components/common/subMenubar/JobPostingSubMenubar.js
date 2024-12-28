import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./JobPostingSubMenubar.module.css";

function JobPostingSubMenubar() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <Link to="/JobPostingSearch" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/JobPostingSearch" ? styles.active : ""}`}>
          채용공고
        </div>
      </Link>

      <Link to="/" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/" ? styles.active : ""}`}>
          즐겨찾기
        </div>
      </Link>
    </div>
  );
}

export default JobPostingSubMenubar;