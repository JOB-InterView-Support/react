import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import styles from "./MyIntroductionDetail.module.css";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";

function MyIntroductionDetail() {
  const { id } = useParams(); // URL에서 id 가져오기
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const [detail, setDetail] = useState(null); // 상세 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        console.log("자기소개서 상세 데이터를 요청합니다. ID:", id);
        const response = await secureApiRequest(`/mypage/intro/detail/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = response.data; // axios를 통한 데이터 접근
        console.log("응답 데이터 확인:", data);
        setDetail(data);
      } catch (err) {
        console.error(
          "자기소개서 상세 데이터를 가져오는 중 오류 발생:",
          err.message
        );
        setError("데이터를 가져오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, secureApiRequest]);

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmWithdrawal = async () => {
    try {
      const response = await secureApiRequest(`/mypage/intro/delete/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          introIsDeleted: "Y",
          introDeletedDate: new Date().toISOString(),
        }),
      });

      if (response.status === 200) {
        alert("자기소개서가 삭제되었습니다.");
        navigate("/myIntroductionList");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 중 오류 발생:", err.message);
    } finally {
      closeModal();
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!detail) return <div>데이터가 없습니다.</div>;

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <div className={styles.headerRow}>
          <h2
            className={styles.subtitle}
          >{`${detail.introTitle}`}</h2>
          <div className={styles.buttons}>
            <button
              className={styles.listButton}
              onClick={() => navigate("/myIntroductionList")}
            >
              목록
            </button>
            <button
              className={styles.editButton}
              onClick={() => navigate(`/MyIntroductionUpdate/${id}`)}
            >
              수정
            </button>
            <button className={styles.deleteButton} onClick={openDeleteModal}>삭제</button>
          </div>
        </div>
        <div className={styles.maincontainer}>
          <div className={styles.rowContainer}>
            <div className={styles.infoBox}>
              <strong>지원 회사명:</strong>
              <div className={styles.content}>
                {detail.applicationCompanyName}
              </div>
            </div>
            <div className={styles.infoBox}>
              <strong>지원 직무:</strong>
              <div className={styles.content}>{detail.workType}</div>
            </div>
            <div className={styles.infoBox}>
              <strong>보유 자격증:</strong>
              <div className={styles.content}>{detail.certificate}</div>
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.contentWrapper}>
            <strong>내용:</strong>
            <div className={styles.bigcontent}>{detail.introContents}</div>
          </div>
          {detail.introIsEdited === 'Y' && (
            <div className={styles.contentWrapper}>
              <strong>피드백:</strong>
              <div className={styles.bigcontent}>{detail.introFeedback}</div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>삭제 확인</h2>
            <p>정말로 <span>{detail.introTitle}</span>를<br /> 삭제 하시겠습니까?</p>
            <button
              className={styles.confirmButton}
              onClick={confirmWithdrawal}
            >
              확인
            </button>
            <button className={styles.cancelButton} onClick={closeModal}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyIntroductionDetail;
