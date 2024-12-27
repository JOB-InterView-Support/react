import React, { useEffect, useState, useContext } from "react";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import { AuthContext } from "../../AuthProvider";
import styles from "./MyIntroductionList.module.css";
import icon from "../../assets/images/icon.png"; // icon.png 파일 import
import { useNavigate } from "react-router-dom";

function MyIntroductionList() {
  const { secureApiRequest } = useContext(AuthContext); // AuthContext에서 secureApiRequest 가져오기
  const [introductions, setIntroductions] = useState([]); // 자기소개서 리스트
  const navigate = useNavigate();

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid"); // 로컬 스토리지에서 UUID 가져오기
    if (storedUuid) {
      console.log("로컬 스토리지에서 UUID를 가져왔습니다:", storedUuid);

      // 데이터 가져오기
      const fetchIntroductions = async () => {
        const storedUuid = localStorage.getItem("uuid"); // 로컬 스토리지에서 UUID 가져오기
        if (!storedUuid) {
          console.error("로컬 스토리지에 UUID가 없습니다.");
          return;
        }
      
        console.log("로컬 스토리지에서 UUID를 가져왔습니다:", storedUuid);
      
        try {
          console.log("자기소개서 데이터를 요청합니다. UUID:", storedUuid);
          const response = await secureApiRequest(`/mypage/intro/${storedUuid}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          console.log("응답 상태 코드:", response.status);
          console.log("응답 전체 데이터:", response);
      
          // `axios` 사용 시 response.data로 접근
          const data = response.data; // JSON 데이터 직접 접근
          console.log("응답 데이터 확인:", data);
      
          if (Array.isArray(data)) {
            const filteredData = data.filter((intro) => intro.introIsDeleted === "N");
            console.log("삭제되지 않은 데이터:", filteredData);
            setIntroductions(filteredData);
          } else {
            console.error("응답 데이터 형식이 예상과 다릅니다:", data);
          }
        } catch (error) {
          console.error("자기소개서 데이터를 가져오는 중 오류 발생:", error.message);
        }
      };
      
      

      fetchIntroductions();
    } else {
      console.error("로컬 스토리지에 UUID가 없습니다.");
    }
  }, [secureApiRequest]); // secureApiRequest 의존성 추가

  const handleItemClick = (id) => {
    navigate(`/myIntroductionList/${id}`);
  };

  const handleNewIntroduction = () => {
    console.log("새 자기소개서 작성 버튼이 클릭되었습니다.");
    navigate("/MyIntroductionInsert");
    // 추가 로직 작성 가능 (페이지 이동, 모달 등)
  };

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <h1 className={styles.subtitle}>자기소개서</h1>
        <div className={styles.listcontainer}>
        <div className={styles.introductionGrid}>
          {/* 새 자기소개서 작성 버튼 */}
          <div className={styles.introductionCardNew}>
            <button onClick={handleNewIntroduction}>
              <div className={styles.circleicon}>
                <img src={icon} alt="Add Icon" className={styles.icon} />
              </div>
              <span>새 자기소개서 작성</span>
            </button>
          </div>

          {introductions.length > 0 ? (
            introductions.map((intro) => (
              <div
                key={intro.introNo}
                className={styles.introductionCard}
                onClick={() => handleItemClick(intro.introNo)} // 클릭 이벤트 추가
              >
                <div className={styles.circleicon}>
                <img src={icon} alt="Add Icon" className={styles.icon} />
                </div>
                <h3>{intro.introTitle}</h3>
                <p>{intro.introDate.split("T")[0]}</p>
                <p>{intro.introContents.substring(0, 20)}...</p>
              </div>
            ))
          ) : (
            <p>등록된 자기소개서가 없습니다.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default MyIntroductionList;