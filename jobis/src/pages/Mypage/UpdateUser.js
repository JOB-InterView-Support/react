import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기

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
    <div>
      <h1>회원정보 수정</h1>
      <div>
        <label>아이디: </label>
        <input type="text" name="userId" value={user.userId} disabled readOnly />
      </div>
      <div>
        <label>이름: </label>
        <input type="text" name="userName" value={user.userName} disabled readOnly />
      </div>
      <div>
        <label>비밀번호:</label>
        <input type="password" name="userPw"  onChange={handleChange} />
      </div>
      <div>
        <label>전화번호:</label>
        <input type="text" name="userPhone"  onChange={handleChange} />
      </div>
      <div>
        <label>이메일:</label>
        <input type="email" name="userDefaultEmail" onChange={handleChange} />
      </div>
      <button onClick={handleUpdate}>수정 완료</button>
    </div>
  );
};

export default UpdateUser;
