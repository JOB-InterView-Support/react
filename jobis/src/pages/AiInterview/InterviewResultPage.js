import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./InterviewResultPage.module.css";

function InterviewResultPage() {
    const { uuid } = useParams(); // URL에서 UUID 추출
    const navigate = useNavigate(); // 페이지 이동용
    const [introduces, setIntroduces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComparisonData = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/interviewResult/compare_self_introduce_interview/${uuid}`
                );
                if (Array.isArray(response.data)) {
                    setIntroduces(response.data);
                } else if (response.data.message) {
                    setError(response.data.message);
                } else {
                    setError("유효하지 않은 데이터 형식입니다.");
                }
            } catch (err) {
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchComparisonData();
    }, [uuid]);

    // 상세 페이지로 이동
    const handleBoxClick = (introNo, isClickable) => {
        if (isClickable) {
            navigate(`/details/${introNo}`);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h1>자기소개서 비교 결과</h1>
            {loading && <p className={styles.error}>데이터를 불러오는 중...</p>}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.gridContainer}>
                {introduces.map((introduce) => (
                    <div
                        className={`${styles.card} ${
                            introduce.status === "N" || introduce.status === "NOT_IN_INTERVIEW"
                                ? styles.disabled
                                : ""
                        }`}
                        key={introduce.intro_no}
                        onClick={() =>
                            handleBoxClick(introduce.intro_no, introduce.status === "Y")
                        }
                        style={{
                            cursor: introduce.status === "Y" ? "pointer" : "not-allowed",
                        }}
                    >
                        <h2>{introduce.intro_title}</h2>
                        {introduce.status === "NOT_IN_INTERVIEW" && (
                            <p className={styles.status}>기록 없음</p>
                        )}
                        {introduce.status === "N" && (
                            <p className={styles.status}>면접 종료되지 않음</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InterviewResultPage;
