import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation 추가
import { AuthContext } from "../../AuthProvider";
import styles from "./AdminMemberManagementDetail.module.css";
import BackButton from "../../components/common/button/BackButton";
import RestricationModal from "./RestricationModal";

function AdminMemberManagementDetail() {
  const location = useLocation(); // state를 가져오기 위해 useLocation 사용
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const [member, setMember] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true); // 모달 열기
  const closeModal = () => setIsModalOpen(false); // 모달 닫기

  // state에서 uuid 추출
  const uuid = location.state?.uuid;

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return ""; // 값이 없는 경우 빈 문자열 반환
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        if (!uuid) {
          alert("유효하지 않은 접근입니다.");
          navigate(-1);
          return;
        }

        const response = await secureApiRequest(
          `/admin/memberDetail?uuid=${uuid}`
        );
        setMember(response.data);
      } catch (error) {
        console.error("회원 정보 가져오는 중 오류 발생:", error.message);
        alert("회원 정보를 불러올 수 없습니다.");
        navigate(-1);
      }
    };

    fetchMemberDetail();
  }, [uuid, secureApiRequest, navigate]);

  const handleLiftSanction = async () => {
    if (!window.confirm(`${member.userName} 회원의 제재를 해제하시겠습니까?`)) {
      return; // 사용자가 '아니오'를 클릭하면 함수 종료
    }

    try {
      await secureApiRequest("/admin/memberLiftSanction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: member.uuid, // 회원의 UUID
        }),
      });

      alert("회원 제재가 성공적으로 해제되었습니다.");
      navigate("/adminMemberDetail");
    } catch (error) {
      console.error("제재 해제 요청 중 오류 발생:", error);
      alert("제재 해제 요청에 실패했습니다.");
    }
  };

  if (!member) {
    return <p>데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div className={styles.container}>
      <h2>회원 상세 정보</h2>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.title}>이름</td>
            <td>{member.userName}</td>
            <td className={styles.title}> 아이디</td>
            <td>{member.userId}</td>
          </tr>
          <tr>
            <td className={styles.title}>이메일</td>
            <td>{member.userDefaultEmail}</td>
            <td className={styles.title}>관리자 여부</td>
            <td> {member.adminYn === "Y" ? "관리자" : "일반"}</td>
          </tr>
          <tr>
            <td className={styles.title}>휴대폰 번호</td>
            <td>{formatPhoneNumber(member.userPhone)}</td>
            <td className={styles.title}>자기소개서 유무</td>
            <td></td>
          </tr>
          <tr>
            <td className={styles.title}>가입일</td>
            <td>{formatDateTime(member.userCreateAt)}</td>
            <td className={styles.title}>마지막 수정 날짜</td>
            <td>{formatDateTime(member.userUpdateAt)}</td>
          </tr>
          <tr>
            <td className={styles.title}>생년월일</td>
            <td>{member.userBirthday}</td>
            <td className={styles.title}>성별</td>
            <td>{member.userGender === "M" ? "남" : "여"}</td>
          </tr>

          <tr>
            <td className={styles.title}>이용권</td>
            <td></td>
            <td className={styles.title}>이용권 유효기간</td>
            <td></td>
          </tr>

          <tr>
            <td className={styles.title}>카카오 이메일</td>
            <td>{member.userKakaoEmail ? member.userKakaoEmail : "없음"}</td>
            <td className={styles.title}>네이버 이메일</td>
            <td>{member.userNaverEmail ? member.userNaverEmail : "없음"}</td>
          </tr>
          <tr>
            <td className={styles.title}>구글 이메일</td>
            <td>{member.userGoogleEmail ? member.userGoogleEmail : "없음"}</td>
            <td className={styles.title}>페이스 아이디 여부</td>
            <td>{member.userFaceIdStatus === "Y" ? "있음" : "없음"}</td>
          </tr>
          <tr>
            <td className={styles.title}>제재 여부</td>
            <td>{member.userRestrictionStatus === "Y" ? "정지" : "이용중"}</td>
            <td className={styles.title}>제재 사유</td>
            <td>{member.userRestrictionReason || "없음"}</td>
          </tr>
          <tr>
            <td className={styles.title}>탈퇴 여부</td>
            <td>{member.userDeletionStatus === "Y" ? "탈퇴" : "미탈퇴"}</td>
            <td className={styles.title}>탈퇴 사유</td>
            <td>{member.userDeletionReason || "없음"}</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.btnContainer}>
        <BackButton />
        {member.userRestrictionStatus === "Y" ? (
          <button
            className={styles.sanctionsLiftedBtn}
            onClick={handleLiftSanction}
          >
            제재 해제
          </button>
        ) : (
          <button className={styles.restricationBtn} onClick={openModal}>
            이용 제재
          </button>
        )}
        {member.userDeletionStatus === "Y" && (
          <button className={styles.unsubscribeBtn}>탈퇴 해제</button>
        )}
      </div>

      {isModalOpen && (
        <RestricationModal onClose={closeModal} memberUuid={uuid} />
      )}
    </div>
  );
}

export default AdminMemberManagementDetail;
