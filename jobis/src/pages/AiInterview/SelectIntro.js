import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./SelectIntro.module.css";
import AiInterviewSubmenubar from "../../components/common/subMenubar/AiInterviewSubMenubar";
import interviewguide from "../../assets/images/interviewguide.png";

function SelectIntro({ resultData, setResultData }) {
  const [permissionStatus, setPermissionStatus] = useState("Checking...");
  useEffect(() => {
    async function checkPermissions() {
      try {
        // 카메라와 마이크 접근 권한 요청
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setPermissionStatus("허용 되었습니다.");
      } catch (error) {
        // 권한 거부 혹은 다른 오류 처리
        if (error.name === "NotAllowedError") {
          setPermissionStatus("허용되지 않았습니다.");
        }
      }
    }

    checkPermissions();
  }, []);

  // props 추가
  const { secureApiRequest } = useContext(AuthContext);

  const [introductions, setIntroductions] = useState([]);
  const [selectedIntro, setSelectedIntro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSubMessage, setStatusSubMessage] = useState("");
  const [isGuideModalOpen, setGuideModalOpen] = useState(false);

  const [isPermissionGuideModalOpen, setPermissionGuideModalOpen] =
    useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("Result Data in SelectIntro:", resultData); // resultData 값 확인
  }, [resultData]);

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

  const requestTicketUsage = async (formattedDate) => {
    try {
      const backendResponse = await secureApiRequest(`/ticket/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: formattedDate }),
      });

      // Axios 응답 구조에서 data를 추출
      const backendResult = backendResponse.data;

      console.log("이용권 차감 응답 데이터:", backendResult);

      // 응답 상태 확인
      if (backendResult.status !== "SUCCESS") {
        console.error("이용권 차감 실패:", backendResult);
        throw new Error(
          backendResult.message || "이용권 차감 중 문제가 발생했습니다."
        );
      }

      return backendResult;
    } catch (error) {
      console.error("이용권 차감 요청 중 오류 발생:", error.message);
      throw error;
    }
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
      // 모의 면접 질문 저장 요청
      setStatusMessage("AI가 질문을 생성하고 있습니다...");
      setStatusSubMessage("잠시만 기다려주세요.");
  
      const response = await fetch(
        "http://127.0.0.1:8000/interview/addQuestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intro_no: selectedIntro }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      const { RoundId, INT_ID } = result;
  
      if (!RoundId || !INT_ID) {
        throw new Error("백엔드 응답에 필요한 데이터가 누락되었습니다.");
      }

      // 성공적으로 질문 생성 후 이용권 차감
      const selectedDate = new Date().toISOString();
      const formattedDate = selectedDate.replace("T", " ").split(".")[0];
      const backendResult = await requestTicketUsage(formattedDate);

      if (backendResult.status !== "SUCCESS") {
        throw new Error("이용권 차감 실패: " + backendResult.message);
      }


      // "곧 모의 면접이 시작됩니다."로 상태 업데이트
      setTimeout(() => {
        setStatusMessage("곧 모의 면접이 시작됩니다.");
        setStatusSubMessage("");
      }, 2000);
  
      // 2초 뒤 화면 이동
      setTimeout(() => {
        navigate(`/aiInterview/${selectedIntro}/${RoundId}/${INT_ID}`);
      }, 4000);
    } catch (error) {
      console.error("오류 발생:", error.message);
      alert("작업 중 오류가 발생했습니다. 다시 시도해주세요.");
      setStatusMessage("작업 중 오류가 발생했습니다.");
      setStatusSubMessage("");
    } finally {
      // `loading` 상태 초기화를 navigate 후로 지연
      setTimeout(() => setLoading(false), 4000);
    }
  };

  const handlePermissionGuideModalOpen = () =>
    setPermissionGuideModalOpen(true);
  const handlePermissionGuideModalClose = () =>
    setPermissionGuideModalOpen(false);

  return (
    <div>
      <AiInterviewSubmenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>AI 모의면접</h1>
        <div className={styles.headerRow}>
          <h2 className={styles.subTitle}>자기소개서 선택</h2>
          <button onClick={handlePermissionGuideModalOpen} className={styles.authorityGuide}>권한 가이드</button>

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
              <p>
                <br />
              </p>
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
            {isPermissionGuideModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <button
                    className={styles.modalCloseButton}
                    onClick={handlePermissionGuideModalClose}
                  >
                    닫기
                  </button>
                  <h2>카메라 및 마이크 권한 가이드</h2>
                  <div className={styles.permissionGuide}>
                    <div>카메라 및 마이크 권한을 허용하고 시작해주세요.</div>
                    <div>팝업에서 허용하거나 아래 지침을 따라주세요.</div>
                    <br/>
                    <div>
                      1. 우측 상단의 점 3개 클릭 <br />
                      2. 설정 클릭 <br />
                      3. 개인 정보 보호 및 보안 클릭 <br />
                      4. 사이트 설정 클릭 <br />
                      5. 최근 활동에서 JOBIS 클릭 <br />
                      6. 카메라와 마이크 허용하기.
                    </div>
                  </div>
                </div>
              </div>
            )}
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
