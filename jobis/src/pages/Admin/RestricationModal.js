import React, { useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthProvider 가져오기
import styles from "./RestricationModal.module.css";

function RestricationModal({ onClose, memberUuid }) {
  const { secureApiRequest } = useContext(AuthContext); // secureApiRequest 가져오기
  const [reason, setReason] = useState(""); // 선택된 제재 사유
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

  const handleSubmit = async () => {
    const finalReason = isInputDisabled ? reason : customReason; // 입력된 최종 사유
    console.log("제재 버튼 누름");
    console.log(memberUuid);
    console.log(finalReason);

    if (!finalReason) {
      alert("사유를 입력하거나 선택하세요.");
      return;
    }

    try {
      // secureApiRequest를 사용하여 서버로 데이터 전송
      await secureApiRequest("/admin/memberRestrict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: memberUuid, // uuid 추가
          userDeletionReason: finalReason, // 정지 사유
        }),
      });

      alert("회원이 성공적으로 제재되었습니다.");
      onClose(); // 모달 닫기
      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("제재 요청 중 오류 발생:", error);
      alert("제재 요청에 실패했습니다.");
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
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className={styles.input}
            placeholder="사유를 입력하세요"
            disabled={isInputDisabled}
          />
        </div>
        <div className={styles.btnContainer}>
          <button onClick={onClose} className={styles.closeBtn}>
            닫기
          </button>
          <button onClick={handleSubmit} className={styles.restricationBtn}>
            제재하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestricationModal;
