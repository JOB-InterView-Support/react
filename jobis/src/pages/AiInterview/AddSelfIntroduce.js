import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./AddSelfIntroduce.module.css";
import AiInterviewSubmenubar from "../../components/common/subMenubar/AiInterviewSubMenubar";;

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
  }); // 자기소개서 데이터를 저장하는 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(""); // 오류 메시지 관리

  // 데이터 가져오기
  useEffect(() => {
    async function fetchSelfIntroduceData() {
      console.log("[INFO] 데이터 가져오기 시작");
      setLoading(true); // 로딩 상태를 true로 설정
      setError(""); // 이전 오류 초기화

      try {
        console.log(`[INFO] introNo: ${introNo}`);

        // 요청 경로와 옵션 확인
        const requestUrl = `http://localhost:8000/intro/detail/${introNo}`;
        console.log(`[DEBUG] 요청 URL: ${requestUrl}`);

        // 인증된 API 요청으로 자기소개서 데이터 가져오기
        const response = await secureApiRequest(requestUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          throw new Error("요청한 데이터가 존재하지 않습니다.");
        }

        console.log("[DEBUG] API 응답 상태 코드:", response.status);
        console.log("[DEBUG] API 응답 데이터:", response.data);

        // 응답 데이터가 JSON 형식인지 확인
        const data = response.data;
        if (data) {
          console.log("[INFO] 응답 데이터:", data);

          // 상태 업데이트
          setSelfIntroduceData({
            introTitle: data.introTitle || "제목이 없습니다.",
            introContents: data.introContents || "내용이 없습니다.",
            applicationCompanyName:
              data.applicationCompanyName || "정보 없음",
            workType: data.workType || "정보 없음",
            certificate: data.certificate || "정보 없음",
            introFeedback: data.introFeedback || "피드백이 없습니다.",
          });

          console.log("[INFO] 상태 업데이트 완료:", data);
        } else {
          throw new Error("서버에서 데이터를 가져올 수 없습니다.");
        }
      } catch (err) {
        console.error("[ERROR] 데이터 가져오기 중 오류 발생:", err.message);
        setError(err.message); // 사용자에게 표시할 오류 메시지
      } finally {
        console.log("[INFO] 데이터 가져오기 완료");
        setLoading(false); // 로딩 상태 종료
      }
    }

    fetchSelfIntroduceData();
  }, [introNo, secureApiRequest]);

  return (
    <div>
      {/* 서브 메뉴바 */}
      <AiInterviewSubmenubar />

      <div className={styles.container}>
        <h1 className={styles.title}>자기소개서 첨삭 상세보기</h1>

        {/* 로딩 상태 */}
        {loading ? (
          <p className={styles.loadingMessage}>로딩 중...</p>
        ) : error ? (
          // 오류 상태
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          // 데이터 렌더링
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
              <label className={styles.label}>첨삭된 내용:</label>
              <p className={styles.value}>
                {selfIntroduceData.introEditedContents}
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
