import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import { AuthContext } from "../../AuthProvider"; // 인증 정보를 가져오기 위한 Context
import styles from "./QnaInsert.module.css"; // CSS 모듈을 통한 스타일링
import FileUploadButton from "../../components/common/button/FileUploadButton"; // 파일 업로드 버튼 컴포넌트
import axios from "axios"; // HTTP 요청을 위한 axios 라이브러리

const QnaInsert = () => {
  // AuthContext에서 사용자 정보를 가져옵니다.
  const { username } = useContext(AuthContext);

  // 로컬스토리지에서 UUID 가져오기
  const uuid = localStorage.getItem("uuid");

  // 상태 변수 선언
  const [title, setTitle] = useState(""); // 질문 제목
  const [content, setContent] = useState(""); // 질문 내용
  const [file, setFile] = useState(null); // 첨부 파일
  const [preview, setPreview] = useState(null); // 이미지 미리보기 URL
  const [isSecret, setIsSecret] = useState(true); // 비밀글 여부
  const navigate = useNavigate(); // 페이지 이동 함수

  // 파일 선택 시 호출되는 함수
  const handleFileChange = (selectedFile) => {
    setFile(selectedFile); // 선택된 파일 상태 저장

    // 이미지 파일의 경우 미리보기를 생성합니다.
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result); // base64 URL로 변환
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null); // 이미지가 아니면 미리보기 제거
    }
  };

  // 질문 등록 버튼 클릭 시 호출되는 함수
  const handleSubmit = async () => {
    // 제목과 내용 입력 확인
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    // UUID와 사용자 정보 확인 로그
    console.log("QnaInsert - 작성자 이름:", username);
    console.log("QnaInsert - UUID:", uuid);

    // FormData 객체 생성하여 서버로 전송할 데이터 설정
    const formData = new FormData();
    formData.append("qTitle", title); // 질문 제목
    formData.append("qContent", content); // 질문 내용
    formData.append("qIsSecret", isSecret ? "Y" : "N"); // 비밀글 여부
    formData.append("qWriter", username || "anonymous"); // 작성자 이름
    formData.append("uuid", uuid); // 로컬스토리지에서 가져온 UUID

    // 첨부 파일이 있으면 추가
    if (file) {
      formData.append("file", file);
    }

    // 인증 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // 토큰 확인
    if (!accessToken || !refreshToken) {
      alert("토큰이 존재하지 않습니다.");
      return;
    }

    try {
      // 서버로 POST 요청 전송
      const response = await axios.post(
        "http://localhost:8080/qna", // 서버 엔드포인트 URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 인증 헤더에 AccessToken 추가
            refreshToken: `Bearer ${refreshToken}`, // 인증 헤더에 RefreshToken 추가
          },
        }
      );

      // 요청 성공 처리
      if (response.status === 201) {
        alert("질문이 등록되었습니다.");
        navigate("/qna"); // Q&A 목록 페이지로 이동
      }
    } catch (error) {
      // 요청 실패 처리
      console.error("질문 등록 실패:", error);
      alert("질문 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 비밀글 여부 토글 함수
  const handleSecretToggle = () => {
    setIsSecret((prev) => !prev); // 이전 상태를 반전
  };

  // 이전 버튼 클릭 시 페이지 이동
  const handleBack = () => {
    navigate("/qna"); // Q&A 목록 페이지로 이동
  };

  // 컴포넌트 렌더링
  return (
    <div className={styles.container}>
      <h1>Q&A 등록</h1>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // 제목 상태 업데이트
          className={styles.titleInput}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)} // 내용 상태 업데이트
          className={styles.textarea}
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <FileUploadButton onFileChange={handleFileChange} /> {/* 파일 업로드 버튼 */}
        {file ? (
          <span className={styles.fileName}>{file.name}</span> // 파일 이름 표시
        ) : (
          <span className={styles.fileName}></span> // 파일이 없으면 메시지 표시
        )}
      </div>
      {preview && (
        <div className={styles.previewContainer}>
          <img
            src={preview}
            alt="미리보기"
            className={styles.previewImage}
            style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
          />
        </div>
      )}
      <div className={styles.formGroup}>
        <label>
          <input
            type="checkbox"
            checked={isSecret}
            onChange={handleSecretToggle} // 비밀글 여부 토글
          />
          비밀글로 설정
        </label>
      </div>
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
