import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InterviewResultDetailPage = () => {
    console.log("InterviewResultDetailPage 컴포넌트가 렌더링되었습니다.");

    // URL에서 intro_no와 int_no 추출
    const { intro_no, int_no } = useParams(); // /details/:intro_no/:int_no 형태로 URL 설정

    const [videoSrc, setVideoSrc] = useState(null);
    const [audioSrc, setAudioSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useRef로 video와 audio 요소 참조
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        console.log("useParams로 추출한 intro_no:", intro_no);
        console.log("useParams로 추출한 int_no:", int_no);

        const fetchMediaPaths = async () => {
            try {
                console.log("Axios를 사용하여 데이터 가져오기 시작...");
                const response = await axios.get(
                    `http://127.0.0.1:8000/interviewResult/interview_detail/${intro_no}/${int_no}`
                );

                console.log("Axios 응답 성공, 응답 데이터:", response.data);

                const { video_path, audio_path } = response.data;

                // 로컬 파일 경로를 HTTP URL로 변환
                const videoHttpPath = video_path.replace(
                    "C:/JOBISIMG",
                    "http://localhost:8001"
                );
                const audioHttpPath = audio_path.replace(
                    "C:/JOBISIMG",
                    "http://localhost:8001"
                );

                console.log("변환된 비디오 경로:", videoHttpPath);
                console.log("변환된 오디오 경로:", audioHttpPath);

                setVideoSrc(videoHttpPath);
                setAudioSrc(audioHttpPath);
                setLoading(false);
            } catch (err) {
                console.error("데이터 가져오기 중 오류 발생:", err.message);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMediaPaths();
    }, [intro_no, int_no]);

    if (loading) {
        console.log("현재 로딩 중입니다...");
        return <div>로딩 중...</div>;
    }

    if (error) {
        console.error("오류가 발생했습니다:", error);
        return <div>오류: {error}</div>;
    }

    return (
        <div>
            <h1>면접 결과 상세 페이지</h1>
            <div>
                <h2>영상</h2>
                <video controls width="600" ref={videoRef}>
                    <source src={videoSrc} type="video/mp4" />
                    브라우저가 영상을 지원하지 않습니다.
                </video>
            </div>
            <div>
                <h2>음성</h2>
                <audio controls ref={audioRef}>
                    <source src={audioSrc} type="audio/mp3" />
                    브라우저가 음성을 지원하지 않습니다.
                </audio>
            </div>
            <button
                onClick={() => {
                    console.log("영상과 음성을 동시에 재생합니다.");
                    const videoElement = videoRef.current;
                    const audioElement = audioRef.current;
                    if (videoElement && audioElement) {
                        videoElement.play();
                        audioElement.play();
                        console.log("영상 및 음성 재생 시작.");
                    } else {
                        console.error("영상 또는 음성 요소를 찾을 수 없습니다.");
                    }
                }}
            >
                영상과 음성 동시 재생
            </button>
        </div>
    );
};

export default InterviewResultDetailPage;
