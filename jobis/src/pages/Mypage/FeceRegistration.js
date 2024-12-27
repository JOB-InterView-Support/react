import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import axios from "axios";
import styles from "./FaceRegistration.module.css"; // CSS 파일 import

const FaceRegistration = () => {
  const videoRef = useRef(null); // 비디오가 표시될 <div> 참조
  const [statusMessage, setStatusMessage] = useState(""); // DB 저장 완료 메시지 상태
  const isEffectCalled = useRef(false); // useEffect 실행 여부 추적
  const navigate = useNavigate(); // 네비게이트 함수 추가

  useEffect(() => {
    if (isEffectCalled.current) return; // 두 번째 실행 방지
    isEffectCalled.current = true; // 첫 번째 실행 이후 true로 설정

    const videoElement = videoRef.current;

    if (videoElement) {
      const uuid = localStorage.getItem("uuid"); // 로컬스토리지에서 UUID 가져오기

      if (!uuid) {
        console.error("UUID가 존재하지 않습니다.");
        return;
      }

      // FastAPI 스트림 URL에 UUID를 쿼리 파라미터로 추가
      const streamUrl = `http://127.0.0.1:8000/face-registration/stream-video?uuid=${uuid}`;

      console.log("파이썬 호출");
      const img = document.createElement("img"); // <img> 요소 생성
      img.src = streamUrl; // 스트림 URL을 <img> 소스로 설정
      img.alt = "Video Stream"; // 대체 텍스트
      img.style.width = "100%"; // 스타일 설정
      img.style.height = "100%";
      videoElement.appendChild(img); // <div>에 <img> 추가
    }

   
    // URL에서 파라미터를 제거하려면 `replaceState`를 사용
    window.history.replaceState({}, "", "/faceRegistration"); // URL에서 쿼리 파라미터를 제거하고 새로고침 후에도 URL이 변경되지 않도록 설정

  }, [navigate]); // 네비게이션 의존성 추가

  return (
    <div className={styles.container}>
      <h1>얼굴 등록 페이지</h1>
      <div ref={videoRef} className={styles.videoBox}></div>
     
    </div>
  );
};

export default FaceRegistration;
