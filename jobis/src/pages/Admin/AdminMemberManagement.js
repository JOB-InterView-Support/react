import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./AdminMemberManagement.module.css";
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";
import Paging from "../../components/common/Paging";

function AdminMemberManagement() {
  const { role, isLoggedIn, refreshAccessToken } = useContext(AuthContext); // refreshAccessToken 추가
  console.log("AdminMemberManagement의 role 값:", role);
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("현재 role 값:", role); // role 값 콘솔 출력
    if (!isLoggedIn || role !== "ADMIN") {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/");
    }
  }, [role, isLoggedIn, navigate]);

  const fetchData = (page) => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(`/admin/adminMemberManagementList?page=${page - 1}&size=${itemsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMembers(response.data.content);
        setTotalItems(response.data.totalElements);
        setCurrentPage(page);
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          console.warn("AccessToken 만료됨. RefreshToken으로 재발급 요청 중...");
          try {
            await refreshAccessToken(); // AuthContext에서 가져온 함수 호출
            fetchData(page); // 새 AccessToken으로 다시 요청
          } catch (refreshError) {
            console.error("Token 재발급 실패:", refreshError);
            alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
            navigate("/login");
          }
        } else {
          console.error("데이터 가져오는 중 오류 발생:", error.response?.data || error.message);
        }
      });
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
