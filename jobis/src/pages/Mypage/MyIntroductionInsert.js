import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import styles from "./MyIntroductionInsert.module.css";

function MyIntroductionInsert() {
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    uuid: localStorage.getItem("uuid") || "", // 로컬 스토리지에서 UUID를 가져옴
    introTitle: "",
    applicationCompanyName: "",
    workType: "",
    certificate: "",
    introContents: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await secureApiRequest(`/mypage/intro/insert`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        alert("자기소개서가 성공적으로 저장되었습니다.");
        navigate("/myIntroductionList");
      } else {
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("저장 중 오류 발생:", error.message);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <div className={styles.headerRow}>
          <h2 className={styles.subtitle}>자기소개서 등록</h2>
          <div className={styles.buttons}>
            <button className={styles.editButton} onClick={handleSave}>
              저장
            </button>
            <button
              className={styles.listButton}
              onClick={() => navigate("/myIntroductionList")}
            >
              취소
            </button>
          </div>
        </div>
        <div className={styles.maincontainer}>
          {/* 자기소개서 제목 입력란 */}
          <div className={styles.infoBoxFull}>
            <strong>자기소개서 제목:</strong>
            <input
              type="text"
              className={styles.titlecontent}
              name="introTitle"
              value={formData.introTitle}
              placeholder="제목 입력"
              onChange={handleInputChange}
              maxLength="30" // 입력 제한
            />
          </div>
          <div className={styles.rowContainer}>
            <div className={styles.infoBox}>
              <strong>지원 회사명:</strong>
              <input
                type="text"
                className={styles.content}
                name="applicationCompanyName"
                value={formData.applicationCompanyName}
                placeholder="지원 회사명"
                maxLength="50"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.infoBox}>
              <strong>지원 직무:</strong>
              <input
                type="text"
                className={styles.content}
                name="workType"
                value={formData.workType}
                placeholder="지원 직무"
                maxLength="50"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.infoBox}>
              <strong>보유 자격증:</strong>
              <input
                type="text"
                className={styles.content}
                name="certificate"
                value={formData.certificate}
                placeholder="보유 자격증"
                maxLength="50"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.contentWrapper}>
            <strong>내용:</strong>
            <textarea
              className={styles.bigcontent}
              name="introContents"
              value={formData.introContents}
              onChange={handleInputChange}
              maxLength="1200" // 입력 제한
              placeholder="최대 1200 글자까지 입력 가능합니다."
              rows="4" // 기본 표시되는 줄 수
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyIntroductionInsert;
