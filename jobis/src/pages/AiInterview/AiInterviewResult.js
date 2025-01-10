import React, { useState, useEffect } from "react";
import styles from "./AiInterviewResult.module.css";
import { useNavigate } from "react-router-dom";
import AiInterviewSubmenubar from "../../components/common/subMenubar/AiInterviewSubMenubar";

function AiInterviewResult() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchInterviewResult() {
      const uuid = localStorage.getItem("uuid");
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/aiInterviewResult/getResult",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uuid }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setResult(data);
        } else {
          throw new Error(
            data.message ||
              "An error occurred while fetching the interview results."
          );
        }
      } catch (error) {
        setError(error.message);
      }
    }

    fetchInterviewResult();
  }, []);

  const handleResultClick = (interviewId, introTitle, interviewRound) => {
    navigate(`/aiInterviewResultDetail/${interviewId}`, {
      state: { introTitle, interviewRound },
    });
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <div className={styles.container}>
      <AiInterviewSubmenubar />
      <div className={styles.resultContainer}>
        {error && <p className={styles.error}>{error}</p>}
        {!error &&
          result &&
          (result.interviews && result.interviews.length > 0 ? (
            result.interviews.map((interview, index) => (
              <div key={index} className={styles.interview}>
                <p className={styles.introTitle}>
                  자기소개서 제목 : {interview.INTRO_TITLE}
                </p>
                <p className={styles.interviewRound}>
                  회차 : {interview.INTERVIEW_ROUND} 회차
                </p>
                <p className={styles.interviewDate}>
                  모의면접 시행 날짜 : {formatDate(interview.INT_DATE)}
                </p>
                {/* <p>Interview ID: {interview.INT_ID}</p> */}
                {/* <p>Intro No: {interview.INTRO_NO}</p> */}
                {interview.CONPLETE_STATUS === "N" ? (
                  <p className={styles.incompleteStatus}>
                    결과 분석중 입니다...
                  </p>
                ) : (
                  <button
                    onClick={() =>
                      handleResultClick(
                        interview.INT_ID,
                        interview.INTRO_TITLE,
                        interview.INTERVIEW_ROUND
                      )
                    }
                    disabled={interview.CONPLETE_STATUS === "N"}
                    className={styles.resultButton}
                  >
                    {interview.CONPLETE_STATUS === "N"
                      ? "결과 분석중 입니다..."
                      : "결과 보기"}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className={styles.noResultMessage}>{result.message}</p>
          ))}
      </div>
    </div>
  );
}

export default AiInterviewResult;
