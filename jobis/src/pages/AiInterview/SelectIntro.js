import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // React Router의 useNavigate import
import { AuthContext } from "../../AuthProvider";
import styles from "./SelectIntro.module.css";

function SelectIntro() {
  const { secureApiRequest } = useContext(AuthContext);
  const [introductions, setIntroductions] = useState([]);
  const [selectedIntro, setSelectedIntro] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [statusMessage, setStatusMessage] = useState(""); // 상태 메시지 관리
  const navigate = useNavigate(); // useNavigate 훅 사용

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

    setLoading(true); // 버튼 비활성화 및 로딩 상태 시작
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
            intro_no: selectedIntro, // 선택된 자기소개서 번호 전달
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("응답 데이터:", result);

      // 상태 확인 주기적 호출 시작
      const statusInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(
            "http://127.0.0.1:8000/interview/status", // 상태 확인 API 엔드포인트
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
            setStatusMessage("이제 곧 시작합니다"); // 버튼 문구 변경
            clearInterval(statusInterval); // 완료 시 interval 중지

            // 2초 뒤에 네비게이트
            setTimeout(() => {
              navigate("/interview"); // /interview 페이지로 이동
            }, 2000);
          }
        } catch (error) {
          console.error("상태 확인 중 오류 발생:", error.message);
          clearInterval(statusInterval); // 오류 발생 시 interval 중지
          setLoading(false); // 로딩 상태 종료
        }
      }, 1000); // 1초마다 상태 확인
    } catch (error) {
      console.error("오류 발생:", error.message);
      alert("예상 질문 저장 중 오류가 발생했습니다.");
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div className={styles.container}>
      <h1>AI 모의면접</h1>

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
                      disabled={loading} // 로딩 중일 때 체크박스 비활성화
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
            disabled={loading} // 로딩 중일 때 버튼 비활성화
          >
            {loading ? statusMessage : "시작하기"} {/* 버튼 텍스트 변경 */}
          </button>
        </>
      ) : (
        <p className={styles.nullMessage}>등록된 자기소개서가 없습니다.</p>
      )}
    </div>
  );
}

export default SelectIntro;
