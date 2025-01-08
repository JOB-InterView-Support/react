import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./SelectSelfIntroduce.module.css";
import AiInterviewSubmenubar from "../../components/common/subMenubar/AiInterviewSubMenubar";

function SelectSelfIntroduce() {
  const { secureApiRequest } = useContext(AuthContext);
  const [introductions, setIntroductions] = useState([]);
  const [selectedIntro, setSelectedIntro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSubMessage, setStatusSubMessage] = useState("");
  const navigate = useNavigate();

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
          setIntroductions(filteredData);
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

  const handleProceed = async () => {
    if (!selectedIntro) {
      alert("자기소개서를 선택해주세요.");
      return;
    }

    const storedUuid = localStorage.getItem("uuid");
    if (!storedUuid) {
      alert("로컬 스토리지에 UUID가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setLoading(true);
    setStatusMessage("작업을 시작합니다...");
    setStatusSubMessage("잠시만 기다려주세요.");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/addSelfIntroduce/insert_self_introduce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intro_no: selectedIntro,
            uuid: storedUuid,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API 오류 응답:", errorData);
        throw new Error(`작업 시작 요청 실패: ${response.status}`);
      }

      const responseData = await response.json();
      const newIntroNo = responseData.new_intro_no;

      setStatusMessage("작업 완료!");
      setStatusSubMessage("");

      navigate(`/myIntroductionList/${newIntroNo}`);
    } catch (error) {
      console.error("작업 시작 중 오류:", error.message);
      setStatusMessage("작업 중 오류가 발생했습니다.");
      setStatusSubMessage("다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIntro = (introNo) => {
    setSelectedIntro(introNo);
  };

  return (
    <div>
      <AiInterviewSubmenubar />
      <div className={styles.container}>
        <h1 className={styles.title}> 첨삭 자기소개서 선택</h1>
        <h2 className={styles.subTitle}>첨삭할 자기소개서를 선택해주세요.</h2>

        {loading ? (
          <p className={styles.loadingMessage}>작업을!!!!!!!!!!!!시작~~~~~~~~~~~~~하겠습니다!!!!!!!!!!!!!!!!!!!!!!!!!!!</p>
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
                        type="checkbox" // 체크박스 스타일 유지
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
              className={styles.startButton} // 정확한 클래스 사용
              onClick={handleProceed}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>{statusMessage}</span>
                  {statusSubMessage && (
                    <div className={styles.statusSubMessage}>
                      {statusSubMessage}
                    </div>
                  )}
                </>
              ) : (
                "선택 완료"
              )}
            </button>
          </div>
        ) : (
          <p className={styles.nullMessage}>등록된 자기소개서가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default SelectSelfIntroduce;
