import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AiInterviewSubmenubar.module.css";

function AiInterviewSubmenubar() {
  const location = useLocation();

  // 로컬 스토리지에서 UUID 가져오기
  const storedUuid = localStorage.getItem("uuid");

  return (
    <div className={styles.container}>
      {/* Ai 모의면접 메뉴 */}
      <Link to="/selectintro" className={styles.menuItem}>
        <div
          className={`${styles.menuItem} ${
            location.pathname === "/selectintro" ? styles.active : ""
          }`}
        >
          Ai 모의면접
        </div>
      </Link>

      {/* 자기소개서 첨삭 메뉴 */}
      <Link to="/selectSelfIntroduce" className={styles.longMenuItem}>
        <div
          className={`${styles.longMenuItem} ${
            location.pathname === "/selectSelfIntroduce" ||
            location.pathname.startsWith("/addSelfIntroduce/")
              ? styles.active
              : ""
          }`}
        >
          자기소개서 첨삭
        </div>
      </Link>

      {/* 내 비교 결과 보기 메뉴 */}
      {/* {storedUuid ? (
        <Link to={`/interviewResults/${storedUuid}`} className={styles.longMenuItem}>
          <div
            className={`${styles.longMenuItem} ${
              location.pathname.startsWith(`/interviewResults/${storedUuid}`)
                ? styles.active
                : ""
            }`}
          >
            내 비교 결과 보기
          </div>
        </Link>
      ) : (
        <div
          className={`${styles.menuItem} ${styles.disabled}`}
          onClick={() => alert("로컬 스토리지에 UUID가 없습니다. 다시 로그인해주세요.")}
        >
          내 비교 결과 보기
        </div>
      )} */}
       {storedUuid ? (
        <Link to={`/aiInterviewResult`} className={styles.longMenuItem}>
          <div>
            모의 면접 결과 보기
          </div>
        </Link>
      ) : (
        <div
          className={`${styles.menuItem} ${styles.disabled}`}
          onClick={() => alert("로컬 스토리지에 UUID가 없습니다. 다시 로그인해주세요.")}
        >
          모의 면접 결과 보기
        </div>
      )}
    </div>
  );
}

export default AiInterviewSubmenubar;
