import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";
import styles from "./DeleteUser.module.css";

function DeleteUser({ memberUuid }) {
  const { secureApiRequest } = useContext(AuthContext);
  const [userDeletionReason, setDeletionReason] = useState(""); // 입력된 사유
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null); // 로컬 스토리지에서 가져올 userId

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userName = localStorage.getItem("userName");
    const role = localStorage.getItem("role");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("로컬 스토리지에 userId가가 없습니다.");
    }
  }, [secureApiRequest]);

  // const handleFeedbackChange = (event) => {
  //   console.log("Feedback:", event.target.value);
  // };

  const handleSecession = async () => {
    console.log("회원 탈퇴 버튼이 클릭되었습니다.");
    console.log("탈퇴 회원 userId:", userId);
    console.log("탈퇴 사유:", userDeletionReason);
  
    if (!userId) {
      alert("회원 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
  
    try {
      const response = await secureApiRequest(`/mypage/secession/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userDeletionStatus: "Y",
          userDeletionReason: userDeletionReason || null,
        }),
      });
  
      if (response.status >= 200 && response.status < 300) {
        console.log("회원 탈퇴가 성공적으로 처리되었습니다.");
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.clear();
        window.location.href = "/";
      } else {
        console.error(`회원 탈퇴 처리 실패: ${response.status}`);
        alert("회원 탈퇴 처리 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("API 호출 중 오류:", error);
      alert("서버와의 통신에 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmWithdrawal = () => {
    setIsModalOpen(false);
    handleSecession();
  };
  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.maincontainer}>
        <h1 className={styles.menutitle}>마이페이지</h1>
        <div className={styles.container}>
          <h1 className={styles.title}>JOBIS</h1>
          <p className={styles.minititle}>회원 탈퇴</p>
          <p className={styles.warning}>
            회원 탈퇴 후 모든 개인정보는 삭제됩니다. 단, 법령에 따라 7일간
            정보는 저장되며, 해당 기간이 경과한 후 자동으로 삭제됩니다. 또한,
            재가입 시에는 신규 회원 기준으로 처리되며, 탈퇴 전의 회원정보와
            이용정보, 적립 내역은 복구되지 않습니다. 탈퇴 후에는 회원 전용
            서비스를 이용하실 수 없습니다.
          </p>
          <textarea
            className={styles.textarea}
            placeholder="*사용자 피드백을 통해 더 나은 서비스를 제공하기 위해 탈퇴 사유를 입력해 주시면 감사하겠습니다."
            onChange={(e) => setDeletionReason(e.target.value)}
          />
          <button className={styles.button} onClick={openModal}>
            회원 탈퇴
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>회원 탈퇴</h2>
            <p>정말로 탈퇴 하시겠습니까?</p>
            <p>탈퇴 후에는 복구가 불가능합니다.</p>
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
export default DeleteUser;
