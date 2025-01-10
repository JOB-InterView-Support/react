import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import styles from "./MyIntroductionUpdate.module.css";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";

function MyIntroductionUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    introTitle: "",
    applicationCompanyName: "",
    workType: "",
    certificate: "",
    introContents: "",
  });

  useEffect(() => {
    // 기존 데이터 불러오기
    const fetchDetail = async () => {
      try {
        const response = await secureApiRequest(`/mypage/intro/detail/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setFormData(response.data); // 기존 데이터로 상태 초기화
      } catch (err) {
        console.error("데이터를 가져오는 중 오류 발생:", err.message);
      }
    };

    fetchDetail();
  }, [id, secureApiRequest]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await secureApiRequest(`/mypage/intro/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        alert("수정이 완료되었습니다.");
        navigate(`/myIntroductionList`);
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("수정 중 오류 발생:", err.message);
    }
  };

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <div className={styles.headerRow}>
          <h2 className={styles.subtitle}>자기소개서 수정</h2>
          <div className={styles.buttons}>
            <button className={styles.editButton} onClick={handleUpdate}>
              수정 완료
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => navigate(`/MyIntroductionList/${id}`)}
            >
              수정 취소
            </button>
          </div>
        </div>
        <div className={styles.maincontainer}>
          <div className={styles.infoBoxFull}>
            <strong>자기소개서 제목:</strong>
            <input
              type="text"
              className={styles.titlecontent}
              name="introTitle"
              value={formData.introTitle}
              onChange={handleInputChange}
              placeholder="제목 입력"
              maxLength="30"
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
                onChange={handleInputChange}
                placeholder="지원 회사명"
                maxLength="50"
              />
            </div>
            <div className={styles.infoBox}>
              <strong>지원 직무:</strong>
              <input
                type="text"
                className={styles.content}
                name="workType"
                value={formData.workType}
                onChange={handleInputChange}
                placeholder="지원 직무"
                maxLength="50"
              />
            </div>
            <div className={styles.infoBox}>
              <strong>보유 자격증:</strong>
              <input
                type="text"
                className={styles.content}
                name="certificate"
                value={formData.certificate}
                onChange={handleInputChange}
                placeholder="보유 자격증"
                maxLength="50"
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
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyIntroductionUpdate;
