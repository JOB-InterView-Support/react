import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./MypageSubMenubar.module.css";

function MypageSubMenubar() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <Link to="/updateUser" className={styles.menuItem}>
        <div
          className={`${styles.menuItem} ${
            location.pathname === "/updateUser" ? styles.active : ""
          }`}
        >
          회원 정보 수정
        </div>
      </Link>

      <Link to="/myTicketList" className={styles.menuItem}>
      <div
        className={`${styles.menuItem} ${
          location.pathname === "/myTicketList" ? styles.active : ""
        }`}
      >
        이용권 내역
      </div>
      </Link>

      <Link to="/deleteUser" className={styles.menuItem}>
        <div
          className={`${styles.menuItem} ${
            location.pathname === "/deleteUser" ? styles.active : ""
          }`}
        >
          회원 탈퇴
        </div>
      </Link>

      <Link to="/myIntroductionList" className={styles.menuItem}>
      <div
        className={`${styles.menuItem} ${
          location.pathname === "/myIntroductionList" ? styles.active : ""
        }`}
      >
        자기소개서
      </div>
      </Link> 
    </div>
  );
}

export default MypageSubMenubar;
