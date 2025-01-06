import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import styles from "./SelectIntro.module.css";

function SelectIntro() {
  const { secureApiRequest } = useContext(AuthContext);
  const [introductions, setIntroductions] = useState([]);
  const [selectedIntro, setSelectedIntro] = useState(null);

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
      alert("예상 질문 및 답변이 성공적으로 저장되었습니다.");
      console.log("응답 데이터:", result);
    } catch (error) {
      console.error("오류 발생:", error.message);
      alert("예상 질문 저장 중 오류가 발생했습니다.");
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
          <button className={styles.startButton} onClick={handleStartClick}>
            시작하기
          </button>
        </>
      ) : (
        <p className={styles.nullMessage}>등록된 자기소개서가 없습니다.</p>
      )}
    </div>
  );
}

export default SelectIntro;
