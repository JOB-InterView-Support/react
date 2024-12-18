import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import apiClient from "../../utils/axios"; // apiClient 가져오기
import styles from "./AdminMemberManagement.module.css";
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";
import Paging from "../../components/common/Paging";

function AdminMemberManagement() {
  const { role, isLoggedIn, refreshAccessToken } = useContext(AuthContext);
  console.log("AdminMemberManagement의 role 값:", role);

  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("현재 role 값:", role);
    if (!isLoggedIn || role !== "ADMIN") {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/login");
    }
  }, [role, isLoggedIn, navigate]);

  const secureApiRequest = async (url, options, retry = true) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("AccessToken이 없습니다.");
  
      const response = await apiClient.get(url, {
        ...options,
        headers: { Authorization: `Bearer ${token}`, ...options?.headers },
      });
  
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401 && retry) {
        console.warn("AccessToken 만료됨. RefreshToken으로 재발급 요청 중...");
        try {
          await refreshAccessToken(); // AuthProvider.js의 함수 호출
          return secureApiRequest(url, options, false); // 재시도
        } catch (refreshError) {
          console.error("Token 재발급 실패:", refreshError);
          throw new Error("세션이 만료되었습니다. 다시 로그인해 주세요.");
        }
      } else {
        throw error;
      }
    }
  };
  

  const fetchData = async (page) => {
    try {
      const response = await secureApiRequest(
        `/admin/adminMemberManagementList?page=${page - 1}&size=${itemsPerPage}`
      );
      setMembers(response.data.content);
      setTotalItems(response.data.totalElements);
      setCurrentPage(page);
    } catch (error) {
      console.error("데이터 가져오는 중 오류 발생:", error.message);
      if (error.message.includes("세션이 만료")) {
        alert(error.message);
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (role === "ADMIN") {
      fetchData(1);
    }
  }, [role]);

  return (
    <div>
      <AdminSubMenubar />

      <div className={styles.container}>
        <h2>회원관리</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>이름</th>
              <th>아이디</th>
              <th>이메일</th>
              <th>가입일</th>
              <th>이용 여부</th>
              <th>관리자 여부</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.uuid}>
                <td>{member.userName}</td>
                <td>{member.userId}</td>
                <td>{member.userDefaultEmail}</td>
                <td>{member.userCreateAt.split("T")[0]}</td>
                <td>{member.userRestrictionStatus === "Y" ? "정지" : "이용중"}</td>
                <td>{member.adminYn === "Y" ? "관리자" : "일반"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Paging
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={fetchData}
        />
      </div>
    </div>
  );
}

export default AdminMemberManagement;
