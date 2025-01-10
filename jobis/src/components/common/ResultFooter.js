import React, { useEffect, useState } from "react";

let hasAnalysisStarted = false; // 전역 변수: API 호출 여부를 추적

const ResultFooter = ({ filename, introNo, roundId, intId, setResultData }) => {
  const [videoMessage, setVideoMessage] = useState("모의 면접 결과 분석 중입니다...");
  const [audioMessage, setAudioMessage] = useState("");

  useEffect(() => {
    const postAnalysis = async () => {
      if (!hasAnalysisStarted && (filename.audio || filename.video || introNo || roundId || intId)) {
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
          try {
            const videoResponse = await fetch(
              "http://127.0.0.1:8000/videoAnalyze/analysis",
              {
                method: "POST",
                body: formDataVideo,
                credentials: "include",
              }
            );
            const videoData = await videoResponse.json();
            console.log("Video Analysis:", videoData);

            if (videoData && videoData.message) {
              setVideoMessage(videoData.message); // 메시지를 설정
            }
          } catch (error) {
            console.error("Error during video analysis:", error);
            setVideoMessage("비디오 분석 중 오류가 발생했습니다.");
          }
        }

        // 오디오 분석 요청
        if (filename.audio) {
          try {
            const audioResponse = await fetch(
              "http://127.0.0.1:8000/audioAnalyze/analysis",
              {
                method: "POST",
                body: formDataAudio,
                credentials: "include",
              }
            );
            const audioData = await audioResponse.json();
            console.log("Audio Analysis:", audioData);

            if (audioData && audioData.message) {
              setAudioMessage(audioData.message); // 메시지를 설정
            }
          } catch (error) {
            console.error("Error during audio analysis:", error);
            setAudioMessage("오디오 분석 중 오류가 발생했습니다.");
          }
        }
      }
    };

    postAnalysis();
  }, [filename, introNo, roundId, intId]);

  const handleTestComplete = () => {
    if (setResultData) {
      setResultData(null);
    }
  };

  return (
    <footer>
      <p>{videoMessage}</p>
      {audioMessage && <p>{audioMessage}</p>}
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
