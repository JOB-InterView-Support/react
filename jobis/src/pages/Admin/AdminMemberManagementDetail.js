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

  const [loading, setLoading] = useState(false);

  // state에서 uuid와 페이지 번호 추출
  const { uuid, page } = location.state;

  console.log("페이지 번호 : ", page)
  // 뒤로가기 함수 수정
  const goBack = () => {
    navigate("/adminMemberManagement", { state: { page } });
  };
  

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
          return; // 여기에서 navigate(-1)을 제거하여 사용자가 직접 뒤로 가기를 선택하도록 함
        }
  
        setLoading(true); // 로딩 상태 활성화
        const response = await secureApiRequest(
          `/admin/memberDetail?uuid=${uuid}`
        );
        setMember(response.data);
        setLoading(false); // 로딩 상태 비활성화
      } catch (error) {
        console.error("회원 정보 가져오는 중 오류 발생:", error.message);
        alert("회원 정보를 불러올 수 없습니다.");
      }
    };
  
    fetchMemberDetail();
  }, [uuid, secureApiRequest]); // navigate 제거

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
      navigate("/adminMemberManagement");
    } catch (error) {
      console.error("제재 해제 요청 중 오류 발생:", error);
      alert("제재 해제 요청에 실패했습니다.");
    }
  };

  const handleUnsubscribeLift = async () => {
    if (
      !window.confirm(`${member.userName} 회원의 탈퇴 상태를 해제하시겠습니까?`)
    ) {
      return; // 사용자가 '아니오'를 클릭하면 함수 종료
    }

    try {
      await secureApiRequest("/admin/memberUnsubscribeLift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: member.uuid, // 회원의 UUID
        }),
      });

      alert("회원의 탈퇴 상태가 성공적으로 해제되었습니다.");
      navigate("/adminMemberManagement");
    } catch (error) {
      console.error("탈퇴 해제 요청 중 오류 발생:", error);
      alert("탈퇴 해제 요청에 실패했습니다.");
    }
  };

  const handleDeleteMember = async () => {
    if (!window.confirm("정말 회원 정보를 삭제하시겠습니까?")) {
      return; // 사용자가 '취소'를 클릭하면 함수 종료
    }

    try {
      const response = await secureApiRequest("/admin/deleteMember", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: member.uuid,
        }),
      });
      // alert(response); // 응답 확인
      alert("회원 정보가 성공적으로 삭제되었습니다.");
      navigate("/adminMemberManagement");
    } catch (error) {
      console.error("회원 삭제 요청 중 오류 발생:", error.message);
      alert("회원 삭제 요청에 실패했습니다.");
    }
  };

  const promoteToAdmin = async () => {
    if (
      !window.confirm(
        `정말로 ${member.userName} 회원을 관리자로 승격시키겠습니까?`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      await secureApiRequest(`/admin/promoteToAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: member.uuid,
        }),
      });

      setMember({ ...member, adminYn: "Y" });
      alert("관리자로 승격되었습니다.");
      navigate("/adminMemberManagement");
    } catch (error) {
      console.error("승격 요청 중 오류 발생:", error);
      alert(`관리자로 승격 요청에 실패했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const demoteToUser = async () => {
    if (
      !window.confirm(
        `정말로 ${member.userName} 회원을 일반 회원으로 변경하시겠습니까?`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      await secureApiRequest(`/admin/demoteToUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: member.uuid,
        }),
      });

      setMember({ ...member, adminYn: "N" });
      alert("일반 회원으로 변경되었습니다.");
      navigate("/adminMemberManagement");
    } catch (error) {
      console.error("강등 요청 중 오류 발생:", error);
      alert(`일반 회원으로 변경 요청에 실패했습니다: ${error.message}`);
    } finally {
      setLoading(false);
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

          {/* <tr>
            <td className={styles.title}>이용권</td>
            <td></td>
            <td className={styles.title}>이용권 유효기간</td>
            <td></td>
          </tr> */}

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
        <BackButton onClick={goBack} />
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
          <>
            <button
              className={styles.unsubscribeBtn}
              onClick={handleUnsubscribeLift}
            >
              탈퇴 해제
            </button>
            <button className={styles.deleteBtn} onClick={handleDeleteMember}>
              회원 삭제
            </button>
          </>
        )}
        {member.adminYn === "Y" ? (
          <button className={styles.changeUserBtn} onClick={demoteToUser}>
            회원으로 변경
          </button>
        ) : (
          <button className={styles.changeAdminBtn} onClick={promoteToAdmin}>
            관리자로 변경
          </button>
        )}
      </div>

      {isModalOpen && (
        <RestricationModal onClose={closeModal} memberUuid={uuid} />
      )}
    </div>
  );
}

export default AdminMemberManagementDetail;
