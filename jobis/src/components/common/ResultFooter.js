import React, { useEffect, useState } from "react";

let hasAnalysisStarted = false; // 전역 변수: API 호출 여부를 추적

const ResultFooter = ({ filename, introNo, roundId, intId, setResultData }) => {
  const [videoMessage, setVideoMessage] = useState(
    "모의 면접 결과 분석 중입니다..."
  );
  const [audioMessage, setAudioMessage] = useState("");
  const [videoStatus, setVideoStatus] = useState(""); // 상태 관리를 위해 useState 사용
  const [audioStatus, setAudioStatus] = useState(""); // 상태 관리를 위해 useState 사용
  const [statusMessage, setStatusMessage] = useState(""); // DB 업데이트 상태 메시지

  useEffect(() => {
    if (
      !hasAnalysisStarted &&
      (filename.audio || filename.video || introNo || roundId || intId)
    ) {
      hasAnalysisStarted = true; // 호출 시작 플래그 설정

      const formDataVideo = new FormData();
      formDataVideo.append("videoFilename", filename.video);
      formDataVideo.append("introNo", introNo);
      formDataVideo.append("roundId", roundId);
      formDataVideo.append("intId", intId);

      const formDataAudio = new FormData();
      formDataAudio.append("audioFilename", filename.audio);
      formDataAudio.append("introNo", introNo);
      formDataAudio.append("roundId", roundId);
      formDataAudio.append("intId", intId);

      // 비디오 분석 요청
      if (filename.video) {
        console.log("비디오 분석 시작");
        fetch("http://127.0.0.1:8000/videoAnalyze/analysis", {
          method: "POST",
          body: formDataVideo,
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Video Analysis:", data);
            setVideoStatus(data.status);
            if (data.message) {
              setVideoMessage(data.message);
            }
          })
          .catch((error) => {
            console.error("Error during video analysis:", error);
            setVideoMessage("비디오 분석 중 오류가 발생했습니다.");
          });
      }

      // 오디오 분석 요청
      if (filename.audio) {
        console.log("오디오 분석 시작");
        fetch("http://127.0.0.1:8000/audioAnalyze/analysis", {
          method: "POST",
          body: formDataAudio,
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Audio Analysis:", data);
            setAudioStatus(data.status);
            if (data.message) {
              setAudioMessage(data.message);
            }
          })
          .catch((error) => {
            console.error("Error during audio analysis:", error);
            setAudioMessage("오디오 분석 중 오류가 발생했습니다.");
          });
      }
    }
  }, [filename, introNo, roundId, intId]);

  useEffect(() => {
    if (videoStatus === "success" && audioStatus === "success") {
      console.log("Both analyses are successful, calling the API...");
      fetch("http://127.0.0.1:8000/aiInterviewSuccess/changeStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intId: intId }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            console.log("DB 완료");
            setStatusMessage("DB 완료"); // 성공적인 DB 업데이트 시 메시지 설정
            setTimeout(() => {
              handleTestComplete();
            }, 3000); // 3000 밀리초 후에 실행
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setStatusMessage("DB 업데이트 실패"); // 실패 시 메시지 설정
        });
    }
  }, [videoStatus, audioStatus, intId]);

  const handleTestComplete = () => {
    if (setResultData) {
      setResultData(null);
    }
  };

  return (
    <footer>
      {videoStatus === "success" && audioStatus === "success" ? (
        <p>비디오, 오디오 분석이 끝났습니다.</p>
      ) : (
        <>
          <p>{videoMessage}</p>
          {audioMessage && <p>{audioMessage}</p>}
        </>
      )}
      {!hasAnalysisStarted && (
        <div>
          <p>Audio File: {filename.audio || "N/A"}</p>
          <p>Video File: {filename.video || "N/A"}</p>
          <p>Intro No: {introNo || "N/A"}</p>
          <p>Round ID: {roundId || "N/A"}</p>
          <p>Interview ID: {intId || "N/A"}</p>
          <div>값없음</div>
        </div>
      )}
      <button onClick={handleTestComplete} style={{ marginTop: "10px" }}>
        테스트 완료
      </button>
    </footer>
  );
};

export default ResultFooter;
