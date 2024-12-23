import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트
import styles from "./QnaInsert.module.css";

const QnaInsert = () => {
  const { secureApiRequest } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await secureApiRequest("/qna", {
        method: "POST",
        data: { title, content },
      });

      if (response.status === 201) {
        alert("질문이 등록되었습니다.");
        navigate("/qna"); // QnA 목록 페이지로 이동
      }
    } catch (error) {
      console.error("질문 등록 실패:", error);
      alert("질문 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.qnaInsertContainer}>
      <h1>질문 등록</h1>
      <div className={styles.formGroup}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
        ></textarea>
      </div>
      <InsertButton onClick={handleSubmit} label="등록" />
    </div>
  );
};

export default QnaInsert;
