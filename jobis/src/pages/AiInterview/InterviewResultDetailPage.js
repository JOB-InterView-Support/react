import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "./InterviewResultDetailPage.module.css";

const InterviewResultDetailPage = () => {
    console.log("InterviewResultDetailPage 컴포넌트가 렌더링되었습니다.");

    const { intro_no, int_no } = useParams(); // /details/:intro_no/:int_no 형태로 URL 설정

    const [videoSrc, setVideoSrc] = useState(null);
    const [audioSrc, setAudioSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handlePlay = () => {
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
    };

    const handlePause = () => {
        console.log("영상과 음성을 동시에 일시 정지합니다.");
        const videoElement = videoRef.current;
        const audioElement = audioRef.current;
        if (videoElement && audioElement) {
            videoElement.pause();
            audioElement.pause();
            console.log("영상 및 음성 일시 정지.");
        } else {
            console.error("영상 또는 음성 요소를 찾을 수 없습니다.");
        }
    };

    const handleStop = () => {
        console.log("영상과 음성을 동시에 정지합니다.");
        const videoElement = videoRef.current;
        const audioElement = audioRef.current;
        if (videoElement && audioElement) {
            videoElement.pause();
            videoElement.currentTime = 0;
            audioElement.pause();
            audioElement.currentTime = 0;
            console.log("영상 및 음성 정지 후 초기화.");
        } else {
            console.error("영상 또는 음성 요소를 찾을 수 없습니다.");
        }
    };

    return (
        <div className={style.interviewDetailContainer}>
            <div className={style.leftContent}>
                <h1 className={style.interviewTitle}>면접 결과 상세 페이지</h1>
                <div className={style.videoContainer}>
                    <video
                        controlsList="nodownload noplaybackrate nofullscreen"
                        controls={false}
                        ref={videoRef}
                        className={style.videoPlayer}
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                    <div className={style.buttonOverlay}>
                        <button className={style.videoButton} onClick={handlePlay}>▶</button>
                        <button className={style.videoButton} onClick={handlePause}>⏸</button>
                        <button className={style.videoButton} onClick={handleStop}>⏹</button>
                    </div>
                </div>
            </div>
            <div className={style.rightContent}>
                {/* 여기에 나중에 추가할 콘텐츠 배치 */}
            </div>
        </div>
    );
};

export default InterviewResultDetailPage;
