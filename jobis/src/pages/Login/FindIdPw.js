import React, { useState } from "react";
import apiClient from "../../utils/axios";
import BackButton from "../../components/common/button/BackButton";
import styles from "./FindIdPw.module.css";

function FindIdPw() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await apiClient.post("/users/findId", {
        userDefaultEmail: email,
      });
      setUserId(response.data.userId);
      setError("");
    } catch (error) {
      console.error("Failed to fetch user ID:", error);
      setError("사용자 ID를 찾을 수 없습니다.");
      setUserId("");
    }
  };

  const handleResetPassword = async () => {
    if (!userId) {
      alert("유효한 사용자 ID가 없습니다. 먼저 ID를 찾으세요.");
    } else {
      try {
        const response = await apiClient.post("/users/resetPw", {
          userId,
          email  // 이메일 주소 추가
        });
        alert("비밀번호 재설정 요청이 처리되었습니다. 이메일을 확인하세요.");
      } catch (error) {
        console.error("비밀번호 재설정 실패:", error);
        alert("비밀번호 재설정 처리 중 오류가 발생했습니다.");
      }
    }
  };
  

  return (
    <div className={styles.TopContainer}>
      <div className={styles.container}>
        <div className={styles.searchIdContainer}>
          <div className={styles.title}>ID 찾기</div>
          <div className={styles.subTitle}>등록한 이메일로 ID 찾기</div>
          <div className={styles.searchIdInputContainer}>
            <input
              className={styles.inputText}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소 입력"
            />
            <button className={styles.searchBtn} onClick={handleSearch}>
              검색하기
            </button>
          </div>
          {userId && (
            <div className={styles.result}>이메일은 "{userId}" 입니다.</div>
          )}
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.searchPwContainer}>
          <div className={styles.title}>PW 재설정</div>
          <div className={styles.pwText}>찾은 이메일로 임시비밀번호를 보내드립니다. <br/>임시비밀번호로 로그인 후 바로 마이페이지에서 비밀번호 변경 바랍니다.</div>
          <button className={styles.resetPwBtn} onClick={handleResetPassword}>
            비밀번호 재설정
          </button>
        </div>
      </div>
      <div className={styles.btnClass}>
        <BackButton />
      </div>
    </div>
  );
}

export default FindIdPw;
