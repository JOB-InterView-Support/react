import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AdminSubMenubar.module.css";

function AiInterviewSubmenubar() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <Link to="/selectintro" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/selectintro" ? styles.active : ""}`}>
          Ai 모의면접
        </div>
      </Link>

      <Link to="/selectSelfIntroduce" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${
            location.pathname === "/selectSelfIntroduce" ||
            location.pathname.startsWith("/addSelfIntroduce/")
             ? styles.active : ""}`}>
          자기소개서 첨삭
        </div>
      </Link>

    </div>
  );
}

export default AiInterviewSubmenubar;
