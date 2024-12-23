import React from "react";
import styles from "./InsertButton.module.css";

function InsertButton({ onClick }) {
  return (
    <button className={styles.insertButton} onClick={onClick}>
      질문 등록
    </button>
  );
}

export default InsertButton;
