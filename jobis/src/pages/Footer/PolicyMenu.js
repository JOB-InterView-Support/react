import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./PolicyMenu.module.css";

function PolicyMenu() {
  const location = useLocation(); // 현재 URL 경로를 가져옴

  return (
    <div className={styles.menuContainer}>
      <ul className={styles.menuList}>
        <li className={`${styles.menuItem} ${location.pathname === "/service" ? styles.active : ""}`}>
          <Link to="/service">이용약관</Link>
        </li>
        <li className={`${styles.menuItem} ${location.pathname === "/privacy" ? styles.active : ""}`}>
          <Link to="/privacy">개인정보 처리방침</Link>
        </li>
      </ul>
    </div>
  );
}

export default PolicyMenu;
