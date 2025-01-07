import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./SelectIntro.module.css";
import AiInterviewSubmenubar from "../../components/common/subMenubar/AiInterviewSubMenubar";
import interviewguide from "../../assets/images/interviewguide.png";

function SelectIntro() {
  const { secureApiRequest } = useContext(AuthContext);
  const [introductions, setIntroductions] = useState([]);
  const [selectedIntro, setSelectedIntro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSubMessage, setStatusSubMessage] = useState("");
  const [isGuideModalOpen, setGuideModalOpen] = useState(false);
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

  const handleGuideModalOpen = () => setGuideModalOpen(true);
  const handleGuideModalClose = () => setGuideModalOpen(false);

  const handleStartClick = async () => {
    if (!selectedIntro) {
      alert("자기소개서를 선택해주세요.");
      return;
    }

    setLoading(true);
    setStatusMessage("서버와 연결 중입니다...");
    setStatusSubMessage("3~5분 정도 소요될 수 있습니다.");

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
        throw new Error(
          "백엔드 응답에 RoundId 또는 INT_ID가 포함되지 않았습니다."
        );
      }

      setStatusMessage("AI가 질문을 생성하고 있습니다...");
      setStatusSubMessage("잠시만 기다려주세요.");

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
            setStatusMessage("AI가 질문을 생성하고 있습니다...");
            setStatusSubMessage("잠시만 기다려주세요.");
          }

          if (statusResult.status === "complete") {
            console.log("모든 작업이 완료되었습니다.");
            setStatusMessage("작업이 완료되었습니다. 인터뷰를 시작합니다!");
            setStatusSubMessage("");

            clearInterval(statusInterval);

            setTimeout(() => {
              navigate(`/aiInterview/${selectedIntro}/${RoundId}/${INT_ID}`);
              // IntNo(자소서 번호) / 회차 / IntRo(인터뷰 번호)
              // navigate(`/aiMockInterview/${selectedIntro}/${RoundId}/${INT_ID}`);
            }, 2000);
          }
        } catch (error) {
          console.error("상태 확인 중 오류 발생:", error.message);
          clearInterval(statusInterval);
          setLoading(false);
          setStatusMessage("작업 중 오류가 발생했습니다. 다시 시도해주세요.");
          setStatusSubMessage("");
        }
      }, 1000);
    } catch (error) {
      console.error("오류 발생:", error.message);
      alert("예상 질문 저장 중 오류가 발생했습니다.");
      setLoading(false);
      setStatusMessage("작업 중 오류가 발생했습니다. 다시 시도해주세요.");
      setStatusSubMessage("");
    }
  };

  return (
    <div>
      <AiInterviewSubmenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>AI 모의면접</h1>
        <div className={styles.headerRow}>
          <h2 className={styles.subTitle}>자기소개서 선택</h2>
          <button className={styles.guideLink} onClick={handleGuideModalOpen}>
            이용 가이드
          </button>
        </div>

        {isGuideModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button
                className={styles.modalCloseButton}
                onClick={handleGuideModalClose}
              >
                닫기
              </button>
              <h2>이용 가이드</h2>
              <p><br /></p>
              <ul>
                <li>1. 자기소개서를 선택하세요.</li>
                <li>2. 시작 버튼을 누른 후 3~5분 뒤 모의면접이 시작됩니다.</li>
                <li className={styles.warning}>
                  ※ 모의면접이 시작되면 이용권 횟수가 차감되며 차감된 이용권은
                  복구가 불가능 합니다.
                </li>
                <li className={styles.referenceText}>▶참고 화면</li>
                <img
                  src={interviewguide}
                  alt="interviewguide"
                  className={styles.interviewguide}
                />
              </ul>
            </div>
          </div>
        )}

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
            <div className={styles.startButtonContainer}>
              <button
                className={styles.startButton}
                onClick={handleStartClick}
                disabled={loading}
              >
                <span className={styles.statusMessage}>
                  {loading ? statusMessage : "시작하기"}
                </span>
                {loading && (
                  <span className={styles.statusSubMessage}>
                    {statusSubMessage}
                  </span>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.nullMessageContainer}>
            <p className={styles.nullMessage}>등록된 자기소개서가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectIntro;
