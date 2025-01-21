import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css";

function BackButton({ onClick }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick(); // 사용자 정의 동작이 있으면 실행
    } else {
      navigate(-1); // 기본 동작은 이전 페이지로 이동
    }
  };

  return (
    <button className={styles.backBtn} onClick={handleBack}>뒤로가기</button>
  );
}

export default BackButton;
