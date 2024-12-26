import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import styles from "./MyIntroductionDetail.module.css";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";

function MyIntroductionDetail() {
  const { id } = useParams(); // URL에서 id 가져오기
  const { secureApiRequest } = useContext(AuthContext);
  const [detail, setDetail] = useState(null); // 상세 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!detail) return <div>데이터가 없습니다.</div>;

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>
          자기소개서 상세 보기 {detail.introTitle}
        </h1>
        <div className={styles.detailCard}>
          <p>
            <strong>지원 회사명:</strong> {detail.applicationCompanyName}
          </p>
          <p>
            <strong>지원 직무:</strong> {detail.workType}
          </p>
          <p>
            <strong>보유 자격증:</strong> {detail.certificate}
          </p>
          <p>
            <strong>내용:</strong>
          </p>
          <div className={styles.content}>{detail.introContents}</div>
        </div>
        <div className={styles.buttons}>
          <button className={styles.editButton}>수정</button>
          <button className={styles.deleteButton}>삭제</button>
        </div>
      </div>
    </div>
  );
}

export default MyIntroductionDetail;
