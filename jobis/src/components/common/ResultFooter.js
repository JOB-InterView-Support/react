import React, { useEffect } from "react";

const ResultFooter = ({
  filename = { audio: "", video: "" },
  introNo = "",
  roundId = "",
  intId = "",
  setResultData, // setResultData를 props로 받음
}) => {
  useEffect(() => {
    // 전달받은 props를 콘솔에 출력
    console.group("ResultFooter Props");
    console.log("Filename (Audio):", filename.audio || "N/A");
    console.log("Filename (Video):", filename.video || "N/A");
    console.log("Intro No:", introNo || "N/A");
    console.log("Round ID:", roundId || "N/A");
    console.log("Interview ID:", intId || "N/A");
    console.groupEnd();
  }, [filename, introNo, roundId, intId]); // props 변화 감지

  // 값이 존재하면 "모의 면접 결과 분석 중입니다..." 표시
  const isDataAvailable =
    filename.audio || filename.video || introNo || roundId || intId;

  const handleTestComplete = () => {
    if (setResultData) {
      setResultData(null); // ResultFooter의 데이터를 초기화
    }
  };

  return (
    <footer>
      {isDataAvailable ? (
        <p>모의 면접 결과 분석 중입니다...</p>
      ) : (
        <>
          <div>값없음</div>
          <p>Audio File: {filename.audio || "N/A"}</p>
          <p>Video File: {filename.video || "N/A"}</p>
          <p>Intro No: {introNo || "N/A"}</p>
          <p>Round ID: {roundId || "N/A"}</p>
          <p>Interview ID: {intId || "N/A"}</p>
        </>
      )}
      <button onClick={handleTestComplete} style={{ marginTop: "10px" }}>
        테스트 완료
      </button>
    </footer>
  );
};

export default ResultFooter;
