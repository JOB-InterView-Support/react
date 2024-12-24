import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import styles from "./DeleteUser.module.css";

function DeleteUser() {
  const handleFeedbackChange = (event) => {
    console.log("Feedback:", event.target.value);
  };

  const handleWithdrawal = () => {
    console.log("회원 탈퇴 버튼이 클릭되었습니다.");
    // 회원 탈퇴 처리 로직을 추가하세요.
  };
  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.maincontainer}>
        <h1 className={styles.menutitle}>마이페이지</h1>
        <div className={styles.container}>
          <h1 className={styles.title}>JOBIS</h1>
          <p className={styles.minititle}>회원 탈퇴</p>
          <p className={styles.warning}>
            회원 탈퇴 후 모든 개인정보는 삭제됩니다. 단, 법령에 따라 7일간
            정보는 저장되며, 해당 기간이 경과한 후 자동으로 삭제됩니다. 또한,
            재가입 시에는 신규 회원 기준으로 처리되며, 탈퇴 전의 회원정보와
            이용정보, 적립 내역은 복구되지 않습니다. 탈퇴 후에는 회원 전용
            서비스를 이용하실 수 없습니다.
          </p>
          <textarea
            className={styles.textarea}
            placeholder="*사용자 피드백을 통해 더 나은 서비스를 제공하기 위해 탈퇴 사유를 입력해 주시면 감사하겠습니다."
            onChange={handleFeedbackChange}
          />
          <button className={styles.button} onClick={handleWithdrawal}>
            탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteUser;
