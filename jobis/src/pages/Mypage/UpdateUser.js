import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./UpdateUser.module.css"; // CSS 모듈 추가

const UpdateUser = () => {
  const { secureApiRequest } = useContext(AuthContext); // secureApiRequest 사용
  const [user, setUser] = useState({
    userId: "",
    userName: "",
    userPw: "",
    userPhone: "",
    userDefaultEmail: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 userId 가져오기
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("로그인 유저 정보 없음");
      setLoading(false);
      return;
    }

    // API로 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await secureApiRequest(`/mypage/${storedUserId}`);
        setUser(response.data);
      } catch (error) {
        console.error("로그인 유저 정보 없음:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [secureApiRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUpdate = async () => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("User ID is missing in localStorage.");
      return;
    }

    try {
      const response = await secureApiRequest(`/mypage/${storedUserId}`, "PUT", user);
      setUser(response.data);
      alert("User information updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user information.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user.userId) return <div>No user data available</div>;

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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>이메일</label>
          <input
            type="email"
            className={styles.input}
            name="userDefaultEmail"
            onChange={handleChange}
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
              onChange={handleChange}
            />
            <input
              type="text"
              className={`${styles.input} ${styles.phoneInput}`}
              name="userPhone2"
              maxLength={4}
              onChange={handleChange}
            />
            <input
              type="text"
              className={`${styles.input} ${styles.phoneInput}`}
              name="userPhone3"
              maxLength={4}
              onChange={handleChange}
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
