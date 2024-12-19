import React, { useState } from "react";
import styles from "./RestricationModal.module.css";

function RestricationModal({ onClose }) {
  const [reason, setReason] = useState(""); // 선택된 제제 사유
  const [customReason, setCustomReason] = useState(""); // 입력된 사유
  const [isInputDisabled, setIsInputDisabled] = useState(false); // input 비활성화 상태 관리

  const handleSelectChange = (e) => {
    const selectedReason = e.target.value;
    setReason(selectedReason);

    if (selectedReason === "직접입력") {
      setIsInputDisabled(false); // 직접 입력 가능
      setCustomReason(""); // 입력 필드 초기화
    } else {
      setIsInputDisabled(true); // 입력 필드 비활성화
      setCustomReason(selectedReason); // 선택된 값 입력 필드에 표시
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>이용 제재 설정</h2>
        <div className={styles.reason}>제재 사유</div>
        <div className={styles.reasonContainer}>
         
          <select onChange={handleSelectChange} className={styles.select}>
            <option value="" disabled selected>
              선택하세요
            </option>
            <option value="부적절한 후기 게시">부적절한 후기 게시</option>
            <option value="의심 회원">의심 회원</option>
            <option value="직접입력">직접입력</option>
          </select>
          <input
            type="text"
            value={customReason} // input 값은 customReason 상태를 사용
            onChange={(e) => setCustomReason(e.target.value)}
            className={styles.input}
            placeholder="사유를 입력하세요"
            disabled={isInputDisabled} // input 활성화/비활성화
          />
        </div>
        <div className={styles.btnContainer}>
          <button onClick={onClose} className={styles.closeBtn}>
            닫기
          </button>
          <button className={styles.restricationBtn}>제재하기</button>
        </div>
      </div>
    </div>
  );
}

export default RestricationModal;
