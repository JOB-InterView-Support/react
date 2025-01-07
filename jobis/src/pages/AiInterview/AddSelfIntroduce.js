import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터 가져오기
import { AuthContext } from "../../AuthProvider"; // 인증 컨텍스트
import styles from "./AddSelfIntroduce.module.css"; // 스타일 파일 연결
import AiInterviewSubmenubar from "../../components/common/subMenubar/AiInterviewSubMenubar";

function AddSelfIntroduce() {
  const { introNo } = useParams(); // URL에서 introNo 파라미터 가져오기
  const { secureApiRequest } = useContext(AuthContext); // 인증된 API 요청 함수
  const [selfIntroduceData, setSelfIntroduceData] = useState({
    introTitle: "",
    introContents: "",
    applicationCompanyName: "",
    workType: "",
    certificate: "",
    introFeedback: "",
  });
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(""); // 오류 메시지 관리

  // 데이터 가져오기
  useEffect(() => {
    async function fetchSelfIntroduceData() {
      setLoading(true); // 로딩 시작
      setError(""); // 이전 오류 초기화

      try {
        // 인증된 API 요청으로 자기소개서 데이터 가져오기
        const response = await secureApiRequest(
          `/mypage/self-introduce/${introNo}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        if (data) {
          setSelfIntroduceData({
            introTitle: data.introTitle || "제목이 없습니다.",
            introContents: data.introContents || "내용이 없습니다.",
            applicationCompanyName: data.applicationCompanyName || "정보 없음",
            workType: data.workType || "정보 없음",
            certificate: data.certificate || "정보 없음",
            introFeedback: data.introFeedback || "피드백이 없습니다.",
          });
        } else {
          throw new Error("서버에서 데이터를 가져올 수 없습니다.");
        }
      } catch (err) {
        console.error(
          "자기소개서 데이터를 가져오는 중 오류 발생:",
          err.message
        );
        setError("자기소개서를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 종료
      }
    }

    fetchSelfIntroduceData();
  }, [introNo, secureApiRequest]);

  return (
    <div>
      <AiInterviewSubmenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>자기소개서 상세보기</h1>

        {loading ? (
          <p className={styles.loadingMessage}>로딩 중...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.selfIntroduce}>
            <div className={styles.field}>
              <label className={styles.label}>제목:</label>
              <p className={styles.value}>{selfIntroduceData.introTitle}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>자기소개서 내용:</label>
              <p className={styles.value}>
                {selfIntroduceData.introContents.length > 200
                  ? `${selfIntroduceData.introContents.substring(0, 200)}...`
                  : selfIntroduceData.introContents}
              </p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>지원 회사명:</label>
              <p className={styles.value}>
                {selfIntroduceData.applicationCompanyName}
              </p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>지원 직무:</label>
              <p className={styles.value}>{selfIntroduceData.workType}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>보유 자격증:</label>
              <p className={styles.value}>{selfIntroduceData.certificate}</p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>피드백 내용:</label>
              <p className={styles.value}>{selfIntroduceData.introFeedback}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddSelfIntroduce;
