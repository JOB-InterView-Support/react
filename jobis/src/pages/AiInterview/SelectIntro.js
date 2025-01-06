import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./SelectIntro.module.css";

function SelectIntro() {
  const { secureApiRequest } = useContext(AuthContext);
  const [introductions, setIntroductions] = useState([]);
  const [selectedIntro, setSelectedIntro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIntroductions = async () => {
      const storedUuid = localStorage.getItem("uuid");
      if (!storedUuid) {
        console.error("로컬 스토리지에 UUID가 없습니다.");
        return;
      }

      try {
        const response = await secureApiRequest(
          `/mypage/intro/${storedUuid}?introIsEdited=N`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        if (Array.isArray(data)) {
          const filteredData = data.filter(
            (intro) => intro.introIsDeleted === "N"
          );
          setIntroductions(filteredData);
        } else {
          console.error("응답 데이터 형식이 예상과 다릅니다:", data);
        }
      } catch (error) {
        console.error(
          "자기소개서 데이터를 가져오는 중 오류 발생:",
          error.message
        );
      }
    };

    fetchIntroductions();
  }, [secureApiRequest]);

  const handleCheckboxChange = (introNo) => {
    setSelectedIntro((prevSelected) =>
      prevSelected === introNo ? null : introNo
    );
  };

  const handleStartClick = async () => {
    if (!selectedIntro) {
      alert("자기소개서를 선택해주세요.");
      return;
    }

    setLoading(true);
    setStatusMessage("로딩 중...");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/interview/addQuestions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intro_no: selectedIntro,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("응답 데이터:", result);

      const { RoundId, INT_ID } = result;
      if (!RoundId || !INT_ID) {
        throw new Error("백엔드 응답에 RoundId 또는 INT_ID가 포함되지 않았습니다.");
      }

      const statusInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(
            "http://127.0.0.1:8000/interview/status",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!statusResponse.ok) {
            throw new Error(`HTTP error! status: ${statusResponse.status}`);
          }

          const statusResult = await statusResponse.json();
          console.log("현재 상태:", statusResult);

          if (statusResult.status === "ing") {
            setStatusMessage("질문 생성 중...");
          }

          if (statusResult.status === "complete") {
            console.log("모든 작업이 완료되었습니다.");
            setStatusMessage("이제 곧 시작합니다");
            clearInterval(statusInterval); // 주기적 호출 중지

            console.log("선택한 자기소개서 번호:", selectedIntro);
            console.log("INTERVIEW_ROUND:", RoundId);
            console.log("저장된 INTERVIEW 테이블의 INT_ID:", INT_ID);

            // RoundId를 navigate로 전달
            setTimeout(() => {
              // navigate(`/interview/${selectedIntro}/${RoundId}`);
              navigate(`/aiInterview/${selectedIntro}/${RoundId}/${INT_ID}`);
            }, 2000);
          }
        } catch (error) {
          console.error("상태 확인 중 오류 발생:", error.message);
          clearInterval(statusInterval); // 오류 발생 시 주기적 호출 중지
          setLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error("오류 발생:", error.message);
      alert("예상 질문 저장 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI 모의면접</h1>
      <h2 className={styles.subTitle}>자기소개서 선택</h2>

      {introductions.length > 0 ? (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>선택</th>
                <th>제목</th>
                <th>날짜</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>
              {introductions.map((intro) => (
                <tr key={intro.introNo}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIntro === intro.introNo}
                      onChange={() => handleCheckboxChange(intro.introNo)}
                      disabled={loading}
                    />
                  </td>
                  <td>{intro.introTitle}</td>
                  <td>{intro.introDate.split("T")[0]}</td>
                  <td>
                    {intro.introContents.length > 20
                      ? `${intro.introContents.substring(0, 20)}...`
                      : intro.introContents}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className={styles.startButton}
            onClick={handleStartClick}
            disabled={loading}
          >
            {loading ? statusMessage : "시작하기"}
          </button>
        </>
      ) : (
        <p className={styles.nullMessage}>등록된 자기소개서가 없습니다.</p>
      )}
    </div>
  );
}

export default SelectIntro;
