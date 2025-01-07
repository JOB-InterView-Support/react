import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./AiInterview.module.css"; // CSS 파일 가져오기

const AiInterview = () => {
  const { intro_no: selectedIntro, round: RoundId, int_id: INT_ID } = useParams();
  const [audioDevices, setAudioDevices] = useState([]); // 마이크 디바이스 목록
  const [selectedMicrophone, setSelectedMicrophone] = useState(null); // 선택된 마이크
  const [isConfirmed, setIsConfirmed] = useState(false); // "확인하기" 버튼 클릭 여부
  const [isTimerStarted, setIsTimerStarted] = useState(false); // "시작하기" 버튼 클릭 여부
  const [timer, setTimer] = useState(20); // 현재 타이머 값
  const [is40Seconds, setIs40Seconds] = useState(false); // 현재 40초 타이머 여부
  const [cycleCount, setCycleCount] = useState(0); // 반복 횟수 카운트
  const [recordingWebSocket, setRecordingWebSocket] = useState(null); // WebSocket 객체
  const canvasRef = useRef(null);

  const uuid = localStorage.getItem("uuid");

  useEffect(() => {
    const getAudioDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const microphones = devices.filter((device) => device.kind === "audioinput");
      setAudioDevices(microphones);
      if (microphones.length > 0) {
        setSelectedMicrophone(microphones[0].deviceId); // 기본 마이크 선택
      }
    };

    getAudioDevices();
  }, []);

  useEffect(() => {
    if (selectedMicrophone && !isConfirmed) {
      let audioContext, analyser, dataArray, stream;

      const setupAudio = async () => {
        try {
          // 마이크 스트림 가져오기
          stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined },
          });

          // AudioContext 및 AnalyserNode 초기화
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          dataArray = new Uint8Array(analyser.frequencyBinCount);

          // 그래프 업데이트 함수
          const drawWaveform = () => {
            const canvas = canvasRef.current;
            if (!canvas) {
              console.error("Canvas not initialized. Skipping drawing.");
              return;
            }
          
            const canvasCtx = canvas.getContext("2d");
            if (!canvasCtx) {
              console.error("Canvas context not available. Skipping drawing.");
              return;
            }
          
            analyser.getByteTimeDomainData(dataArray);
          
            canvasCtx.fillStyle = "#f4f4f4";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
          
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgb(0, 123, 255)";
            canvasCtx.beginPath();
          
            const sliceWidth = (canvas.width * 1.0) / analyser.frequencyBinCount;
            let x = 0;
          
            for (let i = 0; i < analyser.frequencyBinCount; i++) {
              const v = dataArray[i] / 128.0;
              const y = (v * canvas.height) / 2;
          
              if (i === 0) {
                canvasCtx.moveTo(x, y);
              } else {
                canvasCtx.lineTo(x, y);
              }
          
              x += sliceWidth;
            }
          
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
          
            requestAnimationFrame(drawWaveform);
          };
          

          drawWaveform();
        } catch (error) {
          console.error("Error setting up audio:", error);
        }
      };

      setupAudio();

      return () => {
        if (audioContext) {
          audioContext.close();
        }
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [selectedMicrophone, isConfirmed]);

  useEffect(() => {
    if (isTimerStarted) {
      let interval;
      const handleTimer = () => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            if (is40Seconds) {
              setIs40Seconds(false);
              setTimer(20);
              setCycleCount((prevCount) => prevCount + 1);

              if (cycleCount + 1 >= 2) { // 2번 반복 후 종료
                setIsTimerStarted(false);
                if (recordingWebSocket) {
                  recordingWebSocket.send("stop"); // WebSocket으로 녹화 종료 신호 전송
                  recordingWebSocket.close();
                }
              }
            } else {
              setIs40Seconds(true);
              setTimer(40);
            }
            return is40Seconds ? 20 : 40;
          }
          return prevTimer - 1;
        });
      };

      interval = setInterval(handleTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerStarted, is40Seconds, cycleCount, recordingWebSocket]);

  const startRecording = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/interviewSave/record/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: uuid,  // uuid가 올바르게 전달되고 있는지 확인
          intro_no: selectedIntro,  // intro_no가 올바르게 전달되고 있는지 확인
          round_id: RoundId,  // round_id가 올바르게 전달되고 있는지 확인
          int_id: INT_ID,  // int_id가 올바르게 전달되고 있는지 확인
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error starting recording:", errorData.detail);
        throw new Error(`Error: ${response.status} - ${errorData.detail}`);
      }
  
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  
  
  
  

  if (isConfirmed) {
    return (
      <div className={styles.fullscreenContainer}>
        <h1 className={styles.introHeader}>Intro No: {selectedIntro || "Loading..."}</h1>
        <div className={styles.largeCameraContainer}>
          <img
            src="http://127.0.0.1:8000/aiInterview/video_feed"
            alt="Large Camera Stream"
            className={styles.largeCamera}
          />
          {isTimerStarted && cycleCount < 2 && (
            <div
              className={styles.timer}
              style={{ color: is40Seconds ? "red" : "black" }}
            >
              {timer}
            </div>
          )}
          {!isTimerStarted && (
            <button
              className={styles.startButton}
              onClick={() => {
                setIsTimerStarted(true);
                startRecording();
              }}
            >
              시작하기
            </button>
          )}
        </div>
        {cycleCount >= 2 && (
          <div className={styles.completeMessage}>
            <h2>타이머가 모두 종료되었습니다!</h2>
          </div>
        )}
        <div className={styles.largeButtons}>
          <button
            className={styles.backButton}
            onClick={() => {
              setIsConfirmed(false);
              setIsTimerStarted(false);
              setTimer(20);
              setIs40Seconds(false);
              setCycleCount(0);
            }}
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.guide}>
        <h2>마이크 테스트 가이드</h2>
        <p>아래의 가이드를 따라 마이크와 카메라가 제대로 작동하는지 확인하세요.</p>
        <ul>
          <li>마이크와 카메라 권한을 허용해주세요.</li>
          <li>조용한 공간에서 테스트하세요.</li>
          <li>소음이 적은 환경에서 진행해주세요.</li>
        </ul>
      </div>

      <div className={styles.cameraSection}>
        <h2>카메라 스트리밍</h2>
        <img
          src="http://127.0.0.1:8000/aiInterview/video_feed"
          alt="Camera Stream"
          className={styles.cameraFeed}
        />

        <h2>마이크 볼륨</h2>
        <canvas ref={canvasRef} className={styles.volumeCanvas}></canvas>

        <div className={styles.microphoneSelect}>
          <select
            onChange={(e) => setSelectedMicrophone(e.target.value)}
            value={selectedMicrophone || ""}
          >
            {audioDevices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label || `Microphone ${index + 1}`}
              </option>
            ))}
          </select>
          <span className={styles.status}>정상</span>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={() => window.location.reload()}
          >
            취소하기
          </button>
          <button
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={() => setIsConfirmed(true)}
          >
            확인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiInterview;
