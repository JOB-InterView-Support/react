import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 네비게이션을 위해 추가
import styles from "./FaceRegistration.module.css";

function FaceRegistration() {
  const [streamUrl, setStreamUrl] = useState(null); // 스트리밍 URL 상태 관리
  const [intervalId, setIntervalId] = useState(null); // setInterval ID 관리
  const [isRegistering, setIsRegistering] = useState(false); // 등록 상태 관리
  const [isSaved, setIsSaved] = useState(false); // DB 저장 완료 상태
  const navigate = useNavigate(); // 네비게이션 함수

  const handleRegisterClick = () => {
    const uuid = localStorage.getItem("uuid"); // 로컬스토리지에서 uuid 가져오기
    if (uuid) {
      setIsRegistering(true); // 버튼 상태를 "등록중.."으로 변경
      const url = `http://127.0.0.1:8000/faceRegistration/streamVideo?uuid=${uuid}`;
      setStreamUrl(url); // 스트리밍 URL 설정

      // 1초마다 DB 저장 상태를 가져오기
      const id = setInterval(async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/faceRegistration/checkSaveStatus");
          const data = await response.json();
          console.log("DB 저장 상태:", data.db_save_status);

          if (data.db_save_status) {
            // DB 저장 상태가 true로 변경되면
            clearInterval(id); // setInterval 중단
            setIntervalId(null); // interval ID 초기화
            setIsSaved(true); // 저장 완료 상태로 변경

            // 2초 후에 /updateUser 경로로 네비게이트
            setTimeout(() => {
              navigate("/updateUser");
            }, 2000);
          }
        } catch (error) {
          console.error("DB 저장 상태를 가져오는 중 오류 발생:", error);
        }
      }, 1000);
      setIntervalId(id); // interval ID 저장
    } else {
      alert("UUID가 없습니다. 다시 시도해주세요."); // UUID가 없을 경우 경고
    }
  };

  return (
    <div className={styles.container}>
      <h2>얼굴 등록 페이지</h2>
     
      <div>
        {streamUrl && <img src={streamUrl} alt="Streaming" />}
      </div>
      {isSaved && (
        <p className={styles.successMessage}>저장이 완료되었습니다. 잠시만 기다려주세요.</p>
      )} {/* 저장 완료 메시지 표시 */}
      <button
        className={styles.reBtn}
        onClick={handleRegisterClick}
        disabled={isRegistering} // 버튼 비활성화 상태 설정
      >
        {isRegistering ? "등록중..." : "등록하기"} {/* 버튼 텍스트 변경 */}
      </button>
    </div>
  );
}

export default FaceRegistration;
