import React, { useEffect } from "react";

const ResultFooter = ({
  filename = { audio: "", video: "" },
  introNo = "",
  roundId = "",
  intId = "",
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

  return (
    <footer>
      <p>Audio File: {filename.audio || "N/A"}</p>
      <p>Video File: {filename.video || "N/A"}</p>
      <p>Intro No: {introNo || "N/A"}</p>
      <p>Round ID: {roundId || "N/A"}</p>
      <p>Interview ID: {intId || "N/A"}</p>
    </footer>
  );
};

export default ResultFooter;
