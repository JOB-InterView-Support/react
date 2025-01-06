import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./AdminCommonQuestions.module.css";
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";

function AdminCommonQuestions() {
  const [questions, setQuestions] = useState([]); // 초기값: 빈 배열
  const { secureApiRequest } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await secureApiRequest(
          "/interviewCommonQuestions/list",
          {
            method: "GET",
          }
        );

        console.log("API Response:", response); // 응답 데이터 확인

        // 응답 데이터가 배열인지 확인하고 상태 설정
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          console.error("Unexpected response format:", response);
          setQuestions([]); // 데이터가 배열이 아니면 빈 배열 설정
        }
      } catch (error) {
        console.error("Error fetching interview questions:", error);
        alert("데이터를 가져오는 중 오류가 발생했습니다.");
      }
    };

    fetchQuestions();
  }, [secureApiRequest]);

  // 클릭 이벤트 핸들러
  const handleRowClick = (queId) => {
    navigate(`/adminCommonQuestionsDetail/${queId}`); // queId를 URL 파라미터로 전달
  };

  return (
    <div className={styles.container}>
      <AdminSubMenubar />
      <h1>공통 질문 목록</h1>
      <div className={styles.content}>
        {Array.isArray(questions) && questions.length > 0 ? ( // 데이터가 있는 경우 렌더링
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>질문명</th>
                <th>사용 여부</th>
                <th>등록 날짜</th>
                <th>수정 날짜</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr
                  key={question.queId}
                  onClick={() => handleRowClick(question.queId)} // 클릭 이벤트 추가
                  style={{ cursor: "pointer" }} // 클릭 가능하도록 커서 스타일 추가
                >
                  <td>{question.queId}</td>
                  <td>{question.queTitle}</td>
                  <td>{question.queUseStatus}</td>
                  <td>{new Date(question.queInsertDate).toLocaleString()}</td>
                  <td>
                    {question.queUpdateDate
                      ? new Date(question.queUpdateDate).toLocaleString()
                      : "수정 안됨"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>데이터가 없습니다.</p> // 데이터가 없는 경우
        )}
      </div>
      <div className={styles.btnClass}>
        <Link to="/adminInsertCommonQuestions">
          <button className={styles.addBtn}>추가하기</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminCommonQuestions;
