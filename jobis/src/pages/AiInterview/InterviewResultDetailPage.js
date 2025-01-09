import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

const InterviewResultDetailPage = () => {
    console.log("InterviewResultDetailPage 컴포넌트가 렌더링되었습니다.");

    const { int_id } = useParams();
    const { secureApiRequest } = useContext(AuthContext);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("useParams로 추출한 int_id:", int_id);

        const fetchData = async () => {
            console.log(`int_id(${int_id})로 데이터를 가져오는 중입니다...`);

            try {
                const response = await secureApiRequest(`/api/interview_detail/${int_id}`, {
                    method: "GET",
                });

                console.log("서버로부터 가져온 데이터:", response);

                setData(response); // secureApiRequest에서 response.data를 반환하도록 수정된 경우
                setLoading(false);
            } catch (err) {
                console.error("데이터 가져오기 중 오류 발생:", err.message);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [int_id, secureApiRequest]);

    if (loading) {
        console.log("현재 로딩 중입니다...");
        return <div>로딩 중...</div>;
    }

    if (error) {
        console.error("오류가 발생했습니다:", error);
        return <div>오류: {error}</div>;
    }

    console.log("화면에 렌더링할 데이터:", data);

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
                    console.log("영상과 음성을 동시에 재생합니다.");
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
