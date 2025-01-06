import React, { useRef, useEffect, useState } from "react";
import styles from "./InterviewTest.module.css";

const InterviewTest = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [microphoneStatus, setMicrophoneStatus] = useState("Off");
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    let mediaStream = null;

    // 카메라와 마이크 스트림 가져오기
    const initMediaDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStream = stream;

        // 비디오 스트림 연결
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // 오디오 분석기 설정
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 256; // FFT 크기 설정
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // 캔버스에 그리기
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");

        const draw = () => {
          analyser.getByteFrequencyData(dataArray);

          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          canvasCtx.fillStyle = "#f4f4f4";
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
          }

          requestAnimationFrame(draw);
        };

        draw();
        setAudioContext(audioCtx);
      } catch (err) {
        console.error("Error accessing media devices: ", err);
      }
    };

    initMediaDevices();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // 마이크 상태 토글
  const toggleMicrophone = () => {
    setMicrophoneStatus(microphoneStatus === "On" ? "Off" : "On");
  };

  return (
    <div className={styles.container}>
      <h2>마이크 및 카메라 테스트</h2>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          autoPlay
          muted
          className={styles.video}
        />
      </div>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width="400"
          height="150"
          className={styles.canvas}
        ></canvas>
      </div>
      <button
        onClick={toggleMicrophone}
        className={styles.button}
      >
        마이크 상태: {microphoneStatus}
      </button>
    </div>
  );
};

export default InterviewTest;
