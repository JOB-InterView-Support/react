import React, { useEffect, useState } from "react";
import styles from "./AiMockInterview.module.css";

function AiMockInterview() {
  const [cameras, setCameras] = useState([]); // 카메라 목록
  const [microphones, setMicrophones] = useState([]); // 마이크 목록
  const [selectedCamera, setSelectedCamera] = useState(null); // 선택된 카메라
  const [selectedMicrophone, setSelectedMicrophone] = useState(null); // 선택된 마이크
  const [streaming, setStreaming] = useState(false); // 카메라 스트리밍 상태
  const [decibel, setDecibel] = useState(null); // 실시간 데시벨 값
  const [micError, setMicError] = useState(false); // 마이크 에러 상태

  // 카메라 및 마이크 목록 가져오기
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const cameraResponse = await fetch(
          "http://127.0.0.1:8000/aiMockInterview/cameras"
        );
        const cameraData = await cameraResponse.json();
        setCameras(cameraData.cameras);

        const micResponse = await fetch(
          "http://127.0.0.1:8000/aiMockInterview/microphones"
        );
        const micData = await micResponse.json();
        setMicrophones(micData.microphones);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  // 마이크 데시벨 스트리밍 시작
  useEffect(() => {
    if (selectedMicrophone !== null) {
      const eventSource = new EventSource(
        `http://127.0.0.1:8000/aiMockInterview/microphone/${selectedMicrophone}`
      );
      eventSource.onmessage = (event) => {
        console.log("Data received:", event.data); // 데이터 로그
        const data = event.data;
        if (data.startsWith("error:")) {
          setMicError(true);
          setDecibel(null);
        } else {
          setMicError(false);
          setDecibel(data); // 상태 업데이트
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        setMicError(true);
      };

      return () => eventSource.close();
    }
  }, [selectedMicrophone]);

  // 카메라 선택 시 스트리밍 시작
  const handleCameraSelect = (cameraIndex) => {
    setSelectedCamera(cameraIndex);
    setStreaming(true);
  };

  // 마이크 선택 처리
  const handleMicrophoneSelect = (micIndex) => {
    setSelectedMicrophone(micIndex);
  };

  return (
    <div className={styles.container}>
      <h1>AI 모의면접 세팅</h1>
      <div className={styles.selectContainer}>
        <label htmlFor="cameraSelect">카메라 선택:</label>
        <select
          id="cameraSelect"
          onChange={(e) => handleCameraSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            카메라를 선택하세요
          </option>
          {cameras.map((camera, index) => (
            <option key={index} value={index}>
              {camera}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.selectContainer}>
        <label htmlFor="micSelect">마이크 선택:</label>
        <select
          id="micSelect"
          onChange={(e) => handleMicrophoneSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            마이크를 선택하세요
          </option>
          {microphones.map((mic) => (
            <option key={mic.index} value={mic.index}>
              {mic.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.streamContainer}>
        {streaming && selectedCamera !== null ? (
          <img
            src={`http://127.0.0.1:8000/aiMockInterview/stream/${selectedCamera}`}
            alt="Camera Stream"
            className={styles.stream}
          />
        ) : (
          <div className={styles.placeholder}>카메라 스트리밍을 시작하세요</div>
        )}
      </div>
      <div className={styles.decibelContainer}>
        {micError ? (
          <div className={styles.error}>사용할 수 없는 마이크입니다</div>
        ) : (
          <div className={styles.decibel}>
            {decibel !== null ? `현재 데시벨: ${decibel} dB` : "마이크를 선택하세요"}
          </div>
        )}
      </div>
    </div>
  );
}

export default AiMockInterview;
