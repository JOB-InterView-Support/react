import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import styles from "./AiInterview.module.css"; // CSS 파일 가져오기

const AiInterview = ({ setResultData }) => {
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const {
    intro_no: selectedIntro,
    round: RoundId,
    int_id: INT_ID,
  } = useParams();
  const [audioDevices, setAudioDevices] = useState([]); // 마이크 디바이스 목록
  const [selectedMicrophone, setSelectedMicrophone] = useState(null); // 선택된 마이크
  const [isConfirmed, setIsConfirmed] = useState(false); // "확인하기" 버튼 클릭 여부
  const [isTimerStarted, setIsTimerStarted] = useState(false); // "시작하기" 버튼 클릭 여부
  const canvasRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null); // interval ID를 관리
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false); // 인터뷰 완료 상태
  const [filename, setFilename] = useState(null); // 파일명 저장

  const uuid = localStorage.getItem("uuid");
  

  useEffect(() => {
    const getAudioDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const microphones = devices.filter(
        (device) => device.kind === "audioinput"
      );
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
            audio: {
              deviceId: selectedMicrophone
                ? { exact: selectedMicrophone }
                : undefined,
            },
          });

          // AudioContext 및 AnalyserNode 초기화
          audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
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

            const sliceWidth =
              (canvas.width * 1.0) / analyser.frequencyBinCount;
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

  const startRecording = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/interviewSave/record/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: uuid, // uuid가 올바르게 전달되고 있는지 확인
            intro_no: selectedIntro, // intro_no가 올바르게 전달되고 있는지 확인
            round_id: RoundId, // round_id가 올바르게 전달되고 있는지 확인
            int_id: INT_ID, // int_id가 올바르게 전달되고 있는지 확인
          }),
        }
      );

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

  const interviewState = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/interviewSave/state",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching interview state:", errorData);
        throw new Error(`Error: ${response.status} - ${errorData.detail}`);
      }

      const data = await response.json();
      console.group("Interview State Check");
      console.log("Interview State:", data.interviewState);
      console.log("Filename:", data.filename);
      console.log("Intro No:", data.intro_no);
      console.log("Round ID:", data.round_id);
      console.log("Int ID:", data.int_id);
      console.groupEnd();

      if (data.interviewState) {
        clearInterval(intervalId); // Stop periodic calls
        setIntervalId(null); // Reset interval ID
        setIsInterviewCompleted(true); // Mark interview as completed

        // Pass data to ResultFooter
        setResultData({
          filename: data.filename,
          intro_no: data.intro_no,
          round_id: data.round_id,
          int_id: data.int_id,
        });
          // 홈으로 네비게이트
          navigate("/");
      }
    } catch (error) {
      console.error("Error fetching interview state:", error);
    }
  };

  const handleStartButtonClick = () => {
    setIsTimerStarted(true);
    startRecording(); // 기존 녹화 시작 함수 호출

    // 1초마다 interviewState 호출
    const id = setInterval(() => {
      interviewState();
    }, 1000);

    setIntervalId(id); // interval ID 저장
  };

  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 interval 정리
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  if (isConfirmed) {
    return (
      <div className={styles.fullscreenContainer}>
        <h1>얼굴을 가운데에 위치시켜주세요!</h1>
        {isInterviewCompleted ? (
          // 인터뷰 완료 상태일 때
          <h1 className={styles.introHeader}>
            면접이 종료되었습니다. 잠시만 기다려주세요...
          </h1>
        ) : (
          // 인터뷰 진행 중일 때
          <h1 className={styles.introHeader}>
            하단의 시작 버튼을 누르면 카운트 다운후 모의면접이 시작합니다!
          </h1>
        )}

        {/* 인터뷰 진행 중이든 완료 상태든 항상 표시 */}
        <div className={styles.largeCameraContainer}>
          <img
            src="http://127.0.0.1:8000/interviewSave/video_feed"
            alt="Large Camera Stream"
            className={styles.largeCamera}
          />
          {!isTimerStarted && (
            <div className={styles.largeButtons}>
              <button
                className={styles.startButton}
                onClick={handleStartButtonClick}
              >
                시작하기
              </button>
              <button className={styles.backButton}>뒤로가기</button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.guide}>
        <h2>마이크 테스트 가이드</h2>
        <p>
          아래의 가이드를 따라 마이크와 카메라가 제대로 작동하는지 확인하세요.
        </p>
        <ul>
          <li>마이크와 카메라 권한을 허용해주세요.</li>
          <li>조용한 공간에서 테스트하세요.</li>
          <li>소음이 적은 환경에서 진행해주세요.</li>
        </ul>
      </div>

      <div className={styles.cameraSection}>
        <h2>카메라 스트리밍</h2>
        <img
          src="http://127.0.0.1:8000/interviewSave/video_feed"
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
