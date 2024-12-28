import React from "react";
import styles from "./DeleteModal.module.css"; // CSS 모듈

function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null; // 모달이 열리지 않았으면 아무것도 렌더링하지 않음

  return (
    <div className={styles.modalOverlay}> {/* 모달 배경 */}
      <div className={styles.modalContent}> {/* 모달 내용 */}
        <h2 className={styles.modalTitle}>삭제 확인</h2>
        <p className={styles.modalMessage}>정말 삭제하시겠습니까? 삭제 후에는 되돌릴 수 없습니다.</p>
        <div className={styles.buttonGroup}> {/* 버튼 그룹 */}
          <button onClick={onConfirm} className={styles.confirmButton}>삭제</button>
          <button onClick={onClose} className={styles.cancelButton}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
