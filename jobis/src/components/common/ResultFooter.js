import React, { useEffect, useState } from 'react';

const ResultFooter = ({
  filename, 
  introNo, 
  roundId, 
  intId, 
  setResultData
}) => {
  const [isAnalysisRequested, setAnalysisRequested] = useState(false);

  useEffect(() => {
    const postAnalysis = async () => {
      if (!isAnalysisRequested && (filename.audio || filename.video || introNo || roundId || intId)) {
        setAnalysisRequested(true);

        const formDataVideo = new FormData();
        formDataVideo.append('videoFilename', filename.video);
        formDataVideo.append('introNo', introNo);
        formDataVideo.append('roundId', roundId);
        formDataVideo.append('intId', intId);

        const formDataAudio = new FormData();
        formDataAudio.append('audioFilename', filename.audio);
        formDataAudio.append('introNo', introNo);
        formDataAudio.append('roundId', roundId);
        formDataAudio.append('intId', intId);

        if (filename.video) {
          const videoResponse = await fetch('http://127.0.0.1:8000/videoAnalyze/analysis', {
            method: 'POST',
            body: formDataVideo,
            credentials: 'include',
          });
          const videoData = await videoResponse.json();
          console.log('Video Analysis:', videoData);
        }

        if (filename.audio) {
          const audioResponse = await fetch('http://127.0.0.1:8000/audioAnalyze/analysis', {
            method: 'POST',
            body: formDataAudio,
            credentials: 'include',
          });
          const audioData = await audioResponse.json();
          console.log('Audio Analysis:', audioData);
        }
      }
    };

    postAnalysis();
  }, []); // 빈 배열을 사용하여 컴포넌트 마운트 시 한 번만 실행

  const handleTestComplete = () => {
    if (setResultData) {
      setResultData(null);
    }
  };

  return (
    <footer>
      {(filename.audio || filename.video || introNo || roundId || intId) ? (
        <p>모의 면접 결과 분석 중입니다...</p>
      ) : (
        <div>
          <p>Audio File: {filename.audio || "N/A"}</p>
          <p>Video File: {filename.video || "N/A"}</p>
          <p>Intro No: {introNo || "N/A"}</p>
          <p>Round ID: {roundId || "N/A"}</p>
          <p>Interview ID: {intId || "N/A"}</p>
          <div>값없음</div>
        </div>
      )}
      <button onClick={handleTestComplete} style={{ marginTop: '10px' }}>
        테스트 완료
      </button>
    </footer>
  );
};

export default ResultFooter;
