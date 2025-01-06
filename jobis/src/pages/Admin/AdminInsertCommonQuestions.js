import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./AdminInsertCommonQuestions.module.css";

function AdminInsertCommonQuestions() {
  const [questionTitle, setQuestionTitle] = useState(""); // 입력값 상태
  const { secureApiRequest } = React.useContext(AuthContext); // 인증된 API 요청

  const handleInsert = async () => {
    if (!questionTitle.trim()) {
      alert("질문명을 입력해주세요.");
      return;
    }

    try {
      const response = await secureApiRequest("/interviewCommonQuestions/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queTitle: questionTitle }),
      });

      if (response.status === 200) {
        alert("질문이 성공적으로 추가되었습니다.");
        setQuestionTitle(""); // 입력 필드 초기화
      } else {
        alert("질문 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error inserting question:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>공통질문 추가하기</h2>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>질문명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  className={styles.inputText}
                  placeholder="질문명을 입력하세요"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.btnClass}>
        <button className={styles.insertBtn} onClick={handleInsert}>
          추가하기
        </button>
      </div>
    </div>
  );
}

export default AdminInsertCommonQuestions;
