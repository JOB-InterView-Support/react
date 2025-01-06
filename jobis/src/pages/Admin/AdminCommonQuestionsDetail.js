import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./AdminCommonQuestionsDetail.module.css";

import BackButton from "../../components/common/button/BackButton";

function AdminCommonQuestionsDetail() {
  const { queId } = useParams(); // URL 파라미터에서 queId 추출
  const { secureApiRequest } = useContext(AuthContext); // secureApiRequest 사용
  const [question, setQuestion] = useState(null); // 질문 데이터를 저장할 상태
  const [queTitle, setQueTitle] = useState(""); // 질문명 상태
  const [queUseStatus, setQueUseStatus] = useState("Y"); // 사용여부 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionDetail = async () => {
      try {
        const response = await secureApiRequest(
          `/interviewCommonQuestions/detail/${queId}`,
          {
            method: "GET",
          }
        );

        console.log("Question Detail Response:", response);

        setQuestion(response.data); // 데이터 상태 업데이트
        setQueTitle(response.data.queTitle); // queTitle 기본값 설정
        setQueUseStatus(response.data.queUseStatus); // queUseStatus 기본값 설정
      } catch (error) {
        console.error("Error fetching question detail:", error);
        alert("질문 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchQuestionDetail();
  }, [secureApiRequest, queId]);

  const handleUpdate = async () => {
    try {
      const response = await secureApiRequest(
        `/interviewCommonQuestions/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queId,
            queTitle,
            queUseStatus,
          }),
        }
      );

      if (response.status === 200) {
        alert("수정이 성공적으로 완료되었습니다.");
        navigate(`/adminCommonQuestions`);
      } else {
        alert("수정 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      alert("수정 요청 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return; // 사용자가 '아니오'를 클릭하면 함수 종료
    }

    try {
      const response = await secureApiRequest(
        `/interviewCommonQuestions/delete/${queId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        alert("삭제가 성공적으로 완료되었습니다.");
        navigate(`/adminCommonQuestions`); // 삭제 후 목록 페이지로 이동
      } else {
        alert("삭제 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("삭제 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>공통 질문 상세</h1>
      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>질문명</th>
              <th>사용여부</th>
              <th>등록날짜</th>
              <th>수정날짜</th>
            </tr>
          </thead>
          <tbody>
            {question ? (
              <tr>
                <td>
                  <input
                    type="text"
                    value={queTitle} // 상태 값을 표시
                    onChange={(e) => setQueTitle(e.target.value)} // 상태 업데이트
                    className={styles.inputField} // 스타일 클래스
                  />
                </td>
                <td>
                  <select
                    value={queUseStatus} // 상태 값을 표시
                    onChange={(e) => setQueUseStatus(e.target.value)} // 상태 업데이트
                    className={styles.selectField} // 스타일 클래스
                  >
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </td>
                <td>{new Date(question.queInsertDate).toLocaleString()}</td>
                <td>
                  {question.queUpdateDate
                    ? new Date(question.queUpdateDate).toLocaleString()
                    : "수정 안됨"}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4">로딩 중...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.btnClass}>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          삭제하기
        </button>

        <BackButton />
        <button className={styles.updateBtn} onClick={handleUpdate}>
          수정하기
        </button>
      </div>
    </div>
  );
}

export default AdminCommonQuestionsDetail;
