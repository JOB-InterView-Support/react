import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "./FaceLogin.module.css";
import apiClient from "../../utils/axios";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기

function FaceLogin() {
    const [streaming, setStreaming] = useState(false); // 스트리밍 상태
    const [uuidStatus, setUuidStatus] = useState(false); // uuidStatus 상태
    const { setAuthInfo } = useContext(AuthContext); // AuthContext 업데이트 함수
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트
    let intervalId = null; // 인터벌 ID 저장 변수

    const startStreaming = () => {
        setStreaming(true);

        // 1초마다 uuidStatus 호출
        intervalId = setInterval(() => {
            fetch("http://127.0.0.1:8000/faceLogin/uuidStatus")
                .then((response) => response.json())
                .then((data) => {
                    console.log("uuidStatus:", data.uuidStatus);
                    console.log("uuid:", data.uuid);

                    if (data.uuidStatus) {
                        setUuidStatus(true); // uuidStatus 상태 업데이트
                        clearInterval(intervalId);
                        intervalId = null;
                        sendUuidToServer(data.uuid); // UUID 전송
                        console.log("Streaming stopped. UUID:", data.uuid);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching uuidStatus:", error);
                    clearInterval(intervalId); // 에러 발생 시에도 중단
                    intervalId = null;
                    setStreaming(false);
                });
        }, 1000);
    };

    const sendUuidToServer = async (uuid) => {
        try {
            const response = await apiClient.post("/face/receiveUuid", { uuid });

            // 정상 응답 처리
            const { accessToken, refreshToken, userId, userName, role, uuid: receivedUuid } = response.data;

            // 로컬 스토리지에 데이터 저장
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userId", userId || "unknown");
            localStorage.setItem("userName", userName || "unknown");
            localStorage.setItem("role", role || "unknown");
            localStorage.setItem("uuid", receivedUuid || "unknown");

            // AuthContext 업데이트
            setAuthInfo({
                isLoggedIn: true,
                role: role,
                username: userName,
                uuid: receivedUuid,
            });

            alert("페이스 로그인이 성공했습니다.");
            navigate("/"); // 메인 페이지로 이동
        } catch (error) {
            console.error("Error during Face Login:", error);
            alert("페이스 로그인이 실패했습니다. 다시 시도해주세요.");
            setStreaming(false);
        }
    };


    const stopStreaming = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        setStreaming(false);
        setUuidStatus(false); // uuidStatus 상태 초기화
        console.log("Streaming manually stopped.");
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
                disabled={uuidStatus} // uuidStatus가 true면 버튼 비활성화
            >
                {uuidStatus
                    ? "로그인 중..." // uuidStatus가 true일 때
                    : streaming
                    ? "FaceLogin 중..."
                    : "FaceLogin 시작"}
            </button>
        </div>
    );
}

export default FaceLogin;
