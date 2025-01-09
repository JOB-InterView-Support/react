import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const InterviewResultDetailPage = () => {
    const { int_id } = useParams(); // URL에서 int_id 가져오기
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/interview_detail/${int_id}`);
                if (!response.ok) throw new Error("데이터를 가져오지 못했습니다.");
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [int_id]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>오류: {error}</div>;

    return (
        <div>
            <h1>면접 결과 상세 페이지</h1>
            <div>
                <h2>영상</h2>
                <video controls width="600">
                    <source src={data.video_path} type="video/mp4" />
                    브라우저가 영상을 지원하지 않습니다.
                </video>
            </div>
            <div>
                <h2>음성</h2>
                <audio controls>
                    <source src={data.audio_path} type="audio/mpeg" />
                    브라우저가 음성을 지원하지 않습니다.
                </audio>
            </div>
            <button
                onClick={() => {
                    document.querySelector("video").play();
                    document.querySelector("audio").play();
                }}
            >
                영상과 음성 동시 재생
            </button>
        </div>
    );
};

export default InterviewResultDetailPage;
