import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const AiInterview = () => {
  // URL에서 intro_no와 round 값을 가져옵니다.
  const { intro_no: selectedIntro, round: RoundId } = useParams();

  useEffect(() => {
    const callPythonAPI = async () => {
      const uuid = localStorage.getItem("uuid"); // 로컬 스토리지에서 uuid 가져오기

      try {
        const response = await fetch("http://127.0.0.1:8000/aiInterview/setting", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intro_no: selectedIntro,
            round: RoundId,
            uuid: uuid, // 로컬 스토리지에서 가져온 uuid 추가
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Python API Response:", data);
      } catch (error) {
        console.error("Error calling Python API:", error);
      }
    };

    callPythonAPI();
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  return (
    <div>
      <h1>AI Interview Page</h1>
      <p>Selected Intro: {selectedIntro}</p>
      <p>Round ID: {RoundId}</p>
      <div>
        <h2>Camera Feed</h2>
        {/* Python에서 제공하는 카메라 스트리밍 표시 */}
        <img
          src="http://127.0.0.1:8000/aiInterview/video_feed"
          alt="Camera Stream"
          style={{ width: "100%", maxWidth: "600px", border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
};

export default AiInterview;
