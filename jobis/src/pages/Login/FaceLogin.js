import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./FaceLogin.module.css";

function FaceLogin() {
    const [streaming, setStreaming] = useState(false);
    let intervalId = null; // 인터벌 ID 저장 변수

    const startStreaming = () => {
        setStreaming(true);

        // 1초마다 uuidStatus 호출
        intervalId = setInterval(() => {
            fetch("http://127.0.0.1:8000/faceLogin/uuidStatus")
                .then((response) => response.json())
                .then((data) => {
                    console.log("uuidStatus:", data.uuidStatus);
                })
                .catch((error) => console.error("Error fetching uuidStatus:", error));
        }, 1000);
    };

    const stopStreaming = () => {
        // 스트리밍 중단 및 인터벌 클리어
        setStreaming(false);
        clearInterval(intervalId);
    };

    return (
        <div className={style.container}>
            <h2>FaceID 로그인</h2>

            {streaming && (
                <div className={style.videoContainer}>
                    <img
                        src="http://127.0.0.1:8000/faceLogin/stream"
                        alt="실시간 스트리밍"
                        className={style.videoStream}
                    />
                </div>
            )}
            <button
                className={style.startBtn}
                onClick={!streaming ? startStreaming : stopStreaming}
            >
                {!streaming ? "FaceLogin 시작" : "FaceLogin 중..."}
            </button>
        </div>
    );
}

export default FaceLogin;
