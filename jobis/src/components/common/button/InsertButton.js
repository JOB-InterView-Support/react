import React from "react";
import styles from "./InsertButton.module.css";

function InsertButton({ onClick, label }) {
  return (
    <button className={styles.insertButton} onClick={onClick}>
      {label}
    </button>
  );
}

export default InsertButton;
