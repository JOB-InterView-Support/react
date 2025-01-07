import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // 인증 컨텍스트
import styles from "./SelectSelfIntroduce.module.css"; // 스타일 파일 연결
import AiInterviewSubmenubar from "../../components/common/subMenubar/AiInterviewSubMenubar";

function SelectSelfIntroduce() {
  const { secureApiRequest } = useContext(AuthContext); // 인증된 API 요청 함수
  const [introductions, setIntroductions] = useState([]); // 자기소개서 목록 상태
  const [selectedIntro, setSelectedIntro] = useState(null); // 선택된 자기소개서
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(""); // 오류 상태
  const [statusMessage, setStatusMessage] = useState(""); // 상태 메시지
  const navigate = useNavigate();

  // 자기소개서 목록 가져오기
  useEffect(() => {
    const fetchIntroductions = async () => {
      setLoading(true);
      setError("");

      const storedUuid = localStorage.getItem("uuid");
      if (!storedUuid) {
        setError("로컬 스토리지에 UUID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await secureApiRequest(`/mypage/intro/${storedUuid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        if (Array.isArray(data)) {
          const filteredData = data.filter(
            (intro) => intro.introIsDeleted === "N"
          );
          setIntroductions(filteredData); // 삭제되지 않은 자기소개서만 표시
        } else {
          setError("서버로부터 예상치 못한 응답이 반환되었습니다.");
        }
      } catch (err) {
        setError("자기소개서 데이터를 가져오는 중 오류가 발생했습니다.");
        console.error("오류:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIntroductions();
  }, [secureApiRequest]);

  // 상태 확인 및 업데이트 API 호출
  const checkStatusAndUpdate = async () => {
    const interval = setInterval(async () => {
      try {
        const statusResponse = await fetch(
          "http://127.0.0.1:8000/addSelfIntroduce/status",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // CORS 에러 방지
          }
        );

        if (!statusResponse.ok) {
          throw new Error(`HTTP error! status: ${statusResponse.status}`);
        }

        const statusResult = await statusResponse.json();
        console.log("현재 상태 객체:", statusResult);

        if (statusResult.status === "complete") {
          setStatusMessage("작업이 완료되었습니다!");
          clearInterval(interval);

          navigate(`/addSelfIntroduce/${selectedIntro}`); // 페이지 이동
        } else if (statusResult.status === "in_progress") {
          setStatusMessage("AI가 작업 중입니다. 잠시만 기다려주세요...");
        } else {
          setStatusMessage("작업이 시작되지 않았습니다. 다시 시도해주세요.");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("상태 확인 중 오류 발생:", error.message);
        setStatusMessage("상태 확인 중 오류가 발생했습니다.");
        clearInterval(interval);
      }
    }, 5000);
  };

  const handleProceed = async () => {
    if (!selectedIntro) {
      alert("자기소개서를 선택해주세요.");
      return;
    }
    console.log("선택된 introNo:", selectedIntro);

    try {
      // 작업 시작 요청
      const startResponse = await fetch(
        "http://127.0.0.1:8000/addSelfIntroduce/insert_self_introduction",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ intro_no: selectedIntro }),
        }
    );
    
      console.log("API 호출 경로:", "http://127.0.0.1:8000/addSelfIntroduce/update_self_introduce");
        console.log("요청 데이터:", { intro_no: selectedIntro });

      

      if (!startResponse.ok) {
        const errorData = await startResponse.text(); // 오류 응답 내용을 출력
        console.error("작업 시작 요청 실패:", startResponse.status, errorData);
        throw new Error(`작업 시작 요청 실패: ${startResponse.status}`);
      }
      

      console.log("작업 시작 성공");
      setStatusMessage("작업이 시작되었습니다. 상태를 확인합니다...");
      checkStatusAndUpdate(); // 상태 확인 호출
    } catch (error) {
      console.error("작업 시작 중 오류:", error.message);
      setStatusMessage("작업 시작 중 오류가 발생했습니다.");
    }
  };

  const handleSelectIntro = (introNo) => {
    setSelectedIntro((prev) => (prev === introNo ? null : introNo)); // 선택 상태 토글
  };

  return (
    <div>
      <AiInterviewSubmenubar />
      <div className={styles.container}>
        <h1 className={styles.title}> 첨삭 자기소개서 선택</h1>
        <h2 className={styles.subTitle}>첨삭할 자기소개서를 선택해주세요.</h2>

        {loading ? (
          <p className={styles.loadingMessage}>로딩 중...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : introductions.length > 0 ? (
          <div>
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
                        type="radio"
                        checked={selectedIntro === intro.introNo}
                        onChange={() => handleSelectIntro(intro.introNo)}
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
              className={styles.proceedButton}
              onClick={handleProceed}
              disabled={loading}
            >
              {loading ? "처리 중..." : "선택 완료"}
            </button>
            <p className={styles.statusMessage}>{statusMessage}</p>
          </div>
        ) : (
          <p className={styles.nullMessage}>등록된 자기소개서가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default SelectSelfIntroduce;
