import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // URL 파라미터를 가져오기 위한 훅
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
  }); // 자기소개서 데이터를 저장하는 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(""); // 오류 메시지 관리

  // 데이터 가져오기
  useEffect(() => {
    async function fetchSelfIntroduceData() {
      console.log("[INFO] 데이터 가져오기 시작"); // 로그: 함수 실행 시작
      setLoading(true); // 로딩 상태를 true로 설정
      setError(""); // 이전 오류 초기화

      try {
        console.log(`[INFO] introNo: ${introNo}`); // 로그: URL 파라미터 값 출력

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

        console.log("[INFO] API 응답 수신", response); // 로그: API 응답 출력

        const data = response.data; // 응답 데이터 추출
        if (data) {
          console.log("[INFO] 응답 데이터:", data); // 로그: 응답 데이터 출력

          // 상태 업데이트
          setSelfIntroduceData({
            introTitle: data.introTitle || "제목이 없습니다.",
            introContents: data.introContents || "내용이 없습니다.",
            applicationCompanyName: data.applicationCompanyName || "정보 없음",
            workType: data.workType || "정보 없음",
            certificate: data.certificate || "정보 없음",
            introFeedback: data.introFeedback || "피드백이 없습니다.",
          });

          console.log("[INFO] 상태 업데이트 완료:", {
            introTitle: data.introTitle || "제목이 없습니다.",
            introContents: data.introContents || "내용이 없습니다.",
            applicationCompanyName: data.applicationCompanyName || "정보 없음",
            workType: data.workType || "정보 없음",
            certificate: data.certificate || "정보 없음",
            introFeedback: data.introFeedback || "피드백이 없습니다.",
          }); // 로그: 상태 업데이트 데이터 출력
        } else {
          throw new Error("서버에서 데이터를 가져올 수 없습니다."); // 예외 처리
        }
      } catch (err) {
        console.error(
          "[ERROR] 자기소개서 데이터를 가져오는 중 오류 발생:",
          err.message
        ); // 로그: 오류 메시지 출력
        setError("자기소개서를 불러오는 중 오류가 발생했습니다."); // 오류 상태 설정
      } finally {
        console.log("[INFO] 데이터 가져오기 완료"); // 로그: 함수 실행 완료
        setLoading(false); // 로딩 상태 종료
      }
    }

    fetchSelfIntroduceData(); // 함수 호출
  }, [introNo, secureApiRequest]); // 의존성 배열: introNo, secureApiRequest 변경 시 실행

  return (
    <div>
      <AiInterviewSubmenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>자기소개서 첨삭 상세보기</h1>

        {loading ? (
          <p className={styles.loadingMessage}>로딩 중...</p> // 로딩 메시지 출력
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p> // 오류 메시지 출력
        ) : (
          <div className={styles.selfIntroduce}>
            <div className={styles.field}>
              <label className={styles.label}>제목:</label>
              <p className={styles.value}>
                {selfIntroduceData.introTitle}
              </p>{" "}
              {/* 제목 출력 */}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>자기소개서 내용:</label>
              <p className={styles.value}>
                {selfIntroduceData.introContents.length > 200
                  ? `${selfIntroduceData.introContents.substring(0, 200)}...` // 내용이 200자 이상이면 잘라서 표시
                  : selfIntroduceData.introContents}
              </p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>지원 회사명:</label>
              <p className={styles.value}>
                {selfIntroduceData.applicationCompanyName}
              </p>{" "}
              {/* 회사명 출력 */}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>지원 직무:</label>
              <p className={styles.value}>{selfIntroduceData.workType}</p>{" "}
              {/* 직무 출력 */}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>보유 자격증:</label>
              <p className={styles.value}>
                {selfIntroduceData.certificate}
              </p>{" "}
              {/* 자격증 출력 */}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>피드백 내용:</label>
              <p className={styles.value}>
                {selfIntroduceData.introFeedback}
              </p>{" "}
              {/* 피드백 출력 */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddSelfIntroduce;
