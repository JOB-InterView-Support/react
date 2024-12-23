import React from "react";
import styles from "./UpdateButton.module.css";

/**
 * UpdateButton Component
 * 파일 선택 버튼 컴포넌트로, 파일 선택 이벤트를 상위 컴포넌트에 전달합니다.
 * @param {Function} onFileChange - 파일이 선택되었을 때 호출되는 콜백 함수
 */
const UpdateButton = ({ onFileChange }) => {
  /**
   * 파일 입력값이 변경되었을 때 호출되는 함수
   * @param {Object} e - 이벤트 객체
   */
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0]; // 사용자가 선택한 첫 번째 파일
    if (onFileChange) {
      onFileChange(selectedFile); // 상위 컴포넌트로 선택된 파일 전달
    }
  };

  return (
    <div className={styles.fileInputContainer}>
      <label className={styles.fileLabel}>
        <input
          type="file"
          onChange={handleFileInputChange}
          className={styles.fileInput}
        />
      </label>
    </div>
  );
};

export default UpdateButton;
