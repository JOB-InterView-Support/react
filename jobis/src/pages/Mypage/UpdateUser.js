import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import styles from "./UpdateUser.module.css";

const UpdateUser = () => {
  const { secureApiRequest, isAuthInitialized } = useContext(AuthContext);
  const [user, setUser] = useState({
    userId: "",
    userName: "",
    userPw: "",
    userDefaultEmail: "",
    userPhone1: "",
    userPhone2: "",
    userPhone3: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthInitialized) return;

    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("로그인 유저 정보 없음");
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await secureApiRequest(`/mypage/${storedUserId}`);
        const phone = response.data.userPhone || "";
        setUser({
          ...response.data,
          userPhone1: phone.slice(0, 3),
          userPhone2: phone.slice(3, 7),
          userPhone3: phone.slice(7),
        });
      } catch (error) {
        console.error("로그인 유저 정보 없음:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [secureApiRequest, isAuthInitialized]);

  const handleUpdate = async () => {
    const updatedUser = {
      ...user,
      userPhone: `${user.userPhone1 || ""}${user.userPhone2 || ""}${user.userPhone3 || ""}`,
    };

    delete updatedUser.userPhone1;
    delete updatedUser.userPhone2;
    delete updatedUser.userPhone3;

    try {
      const response = await secureApiRequest(`/mypage/${user.userId}`, {
        method: "PUT",
        data: updatedUser,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setUser(response.data);
      alert("회원 정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      alert("Failed to update user information.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>마이페이지</h1>
      <h2 className={styles.subTitle}>회원 정보 수정</h2>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>이 름</label>
          <input
            type="text"
            className={styles.input}
            name="userName"
            value={user.userName}
            onChange={handleUpdate}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>아이디</label>
          <input
            type="text"
            className={styles.input}
            name="userId"
            value={user.userId}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>비밀번호</label>
          <input
            type="password"
            className={styles.input}
            name="userPw"
            onChange={handleUpdate}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>이메일</label>
          <input
            type="email"
            className={styles.input}
            name="userDefaultEmail"
            onChange={handleUpdate}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>휴대폰 번호</label>
          <div className={styles.phoneInputGroup}>
            <input
              type="text"
              className={`${styles.input} ${styles.phoneInput}`}
              name="userPhone1"
              maxLength={3}
              onChange={handleUpdate}
            />
            <input
              type="text"
              className={`${styles.input} ${styles.phoneInput}`}
              name="userPhone2"
              maxLength={4}
              onChange={handleUpdate}
            />
            <input
              type="text"
              className={`${styles.input} ${styles.phoneInput}`}
              name="userPhone3"
              maxLength={4}
              onChange={handleUpdate}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button type="button" className={styles.button} onClick={handleUpdate}>
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
