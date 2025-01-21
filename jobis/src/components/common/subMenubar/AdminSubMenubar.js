import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AdminSubMenubar.module.css";

function AdminSubMenubar() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <Link to="/adminMemberManagement" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/adminMemberManagement" ? styles.active : ""}`}>
          회원관리
        </div>
      </Link>

      {/* <Link to="/adminStatistics" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/adminStatistics" ? styles.active : ""}`}>
          통계
        </div>
      </Link> */}

      <Link to="/adminSalesHistory" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/adminSalesHistory" ? styles.active : ""}`}>
          판매내역
        </div>
      </Link>

      <Link to="/adminCommonQuestions" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/adminCommonQuestions" ? styles.active : ""}`}>
          공통질문
        </div>
      </Link>
    </div>
  );
}

export default AdminSubMenubar;
