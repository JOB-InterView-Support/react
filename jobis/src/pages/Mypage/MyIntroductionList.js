import React, { useEffect, useState, useContext } from "react";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import { AuthContext } from "../../AuthProvider";
import styles from "./MyIntroductionList.module.css";
import icon from "../../assets/images/icon.png";
import { useNavigate } from "react-router-dom";

function MyIntroductionList() {
  const { secureApiRequest } = useContext(AuthContext);
  const [introductions, setIntroductions] = useState([]);
  const [filteredIntroductions, setFilteredIntroductions] = useState([]);
  const [filter, setFilter] = useState("N"); // 필터 상태 ('N' 또는 'Y')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIntroductions = async () => {
      const storedUuid = localStorage.getItem("uuid");
      if (!storedUuid) {
        console.error("로컬 스토리지에 UUID가 없습니다.");
        return;
      }

      try {
        const response = await secureApiRequest(`/mypage/intro/${storedUuid}?introIsEdited=${filter}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        if (Array.isArray(data)) {
          const filteredData = data.filter((intro) => intro.introIsDeleted === "N");
          setIntroductions(filteredData);
          setFilteredIntroductions(
            filteredData.filter((intro) => intro.introIsEdited === filter)
          );
        } else {
          console.error("응답 데이터 형식이 예상과 다릅니다:", data);
        }
      } catch (error) {
        console.error("자기소개서 데이터를 가져오는 중 오류 발생:", error.message);
      }
    };

    fetchIntroductions();
  }, [secureApiRequest, filter]);

  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
    setFilteredIntroductions(
      introductions.filter((intro) => intro.introIsEdited === filterValue)
    );
  };

  const handleItemClick = (id) => {
    navigate(`/myIntroductionList/${id}`);
  };

  const handleNewIntroduction = async () => {
    const storedUuid = localStorage.getItem("uuid");
    try {
      const response = await secureApiRequest(`/mypage/intro/check-limit/${storedUuid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        navigate("/MyIntroductionInsert");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data); // "최대 자기소개서 작성 가능 수 10개입니다." 출력
      } else {
        console.error("오류 발생:", error.message);
      }
    }
  };

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <div className={styles.subtitleContainer}>
          <h1 className={styles.subtitle}>자기소개서</h1>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.filterButton} ${
                filter === "N" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("N")}
            >
              작성본
            </button>
            <button
              className={`${styles.filterButton} ${
                filter === "Y" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("Y")}
            >
              첨삭본
            </button>
          </div>
        </div>
        <div className={styles.listcontainer}>
          <div className={styles.introductionGrid}>
            <div className={styles.introductionCardNew}>
              <button onClick={handleNewIntroduction}>
                <div className={styles.circleicon}>
                  <img src={icon} alt="Add Icon" className={styles.icon} />
                </div>
                <span>새 자기소개서 작성</span>
              </button>
            </div>
            {filteredIntroductions.length > 0 ? (
              filteredIntroductions.map((intro) => (
                <div
                  key={intro.introNo}
                  className={styles.introductionCard}
                  onClick={() => handleItemClick(intro.introNo)}
                >
                  <div className={styles.circleicon}>
                    <img src={icon} alt="Add Icon" className={styles.icon} />
                  </div>
                  <h3>{intro.introTitle}</h3>
                  <div className={styles.minicontents}>
                    <p>{intro.introDate.split("T")[0]}</p>
                    <p>
                      {intro.introContents.length > 8
                        ? `${intro.introContents.substring(0, 8)}...`
                        : intro.introContents}
                    </p>
                  </div>
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
