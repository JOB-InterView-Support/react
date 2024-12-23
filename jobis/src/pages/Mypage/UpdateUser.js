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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const updatedUser = {
        userId: user.userId,
        userPw: user.userPw || "", // 비밀번호 (공백 허용)
        userName: user.userName,
        userDefaultEmail: user.userDefaultEmail,
        userPhone: `${user.userPhone1}${user.userPhone2}${user.userPhone3}`,
      };
  
      console.log("Sending JSON Data:", updatedUser);
  
      await secureApiRequest(`/mypage/${user.userId}`, {
        method: "PUT",
        body: JSON.stringify(updatedUser), // JSON 데이터로 변환
        headers: {
          "Content-Type": "application/json", // 반드시 JSON 형식으로 지정
        },
      });
  
      alert("회원 정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      alert("회원 정보 수정 요청에 실패했습니다.");
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
            value={user.userDefaultEmail}
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
              value={user.userPhone1}
              maxLength={3}
              onChange={handleChange}
            />
            <input
              type="text"
              className={`${styles.input} ${styles.phoneInput}`}
              name="userPhone2"
              value={user.userPhone2}
              maxLength={4}
              onChange={handleChange}
            />
            <input
              type="text"
              className={`${styles.input} ${styles.phoneInput}`}
              name="userPhone3"
              value={user.userPhone3}
              maxLength={4}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleUpdate} className={styles.button}>
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
