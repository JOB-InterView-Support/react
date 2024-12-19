import React from "react";
import {useNavigate} from "react-router-dom";
import styles from "./BackButton.module.css";


function BackButton() {
  const navigate = useNavigate();

  return (
    <button className={styles.backBtn} onClick={() => navigate(-1)}>뒤로가기</button>
  );
}

export default BackButton;
