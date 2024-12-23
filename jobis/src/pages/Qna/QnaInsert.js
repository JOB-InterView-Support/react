import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./QnaInsert.module.css";
import UpdateButton from "../../components/common/button/UpdateButton";

const QnaInsert = () => {
  const { secureApiRequest } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // 이미지 미리보기 상태
  const navigate = useNavigate();

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null); // 이미지가 아닌 경우 미리보기 제거
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await secureApiRequest("/qna", {
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("질문이 등록되었습니다.");
        navigate("/qna");
      }
    } catch (error) {
      console.error("질문 등록 실패:", error);
      alert("질문 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleBack = () => {
    navigate("/qna");
  };

  return (
    <div className={styles.container}>
      <h1>Q&A</h1>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <UpdateButton onFileChange={handleFileChange} />
        {file ? (
          <span className={styles.fileName}>{file.name}</span>
        ) : (
          <span className={styles.fileName}>선택된 파일 없음</span>
        )}
      </div>
      {preview && (
        <div className={styles.previewContainer}>
          <img src={preview} alt="미리보기" 
          className={styles.previewImage} 
          style={{ maxWidth : "100%", maxHeight: "300px", objectFit: "contain"}}
          />
        </div>
      )}
      <div className={styles.buttonGroup}>
        <button onClick={handleBack} className={styles.backButton}>
          이전으로
        </button>
        <button onClick={handleSubmit} className={styles.submitButton}>
          질문 등록
        </button>
      </div>
    </div>
  );
};

export default QnaInsert;
