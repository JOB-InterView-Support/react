import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminMemberManagement.module.css";
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";
import Paging from "../../components/common/Paging";

function AdminMemberManagement() {
  const [members, setMembers] = useState([]); // 사용자 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalItems, setTotalItems] = useState(0); // 전체 데이터 개수
  const itemsPerPage = 10; // 페이지당 보여줄 아이템 수

  // 데이터 가져오기
  const fetchData = (page) => {
    const token = localStorage.getItem("accessToken");
  
    axios
      .get(`/admin/adminMemberManagementList?page=${page - 1}&size=${itemsPerPage}`, { // 서버는 0부터 시작
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMembers(response.data.content); // 현재 페이지 데이터
        setTotalItems(response.data.totalElements); // 전체 데이터 수
        setCurrentPage(page); // 현재 페이지 설정
      })
      .catch((error) => {
        console.error("데이터 가져오는 중 오류 발생:", error.response?.data || error.message);
      });
  };
  

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchData(1);
  }, []);

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

        {/* 페이징 컴포넌트 */}
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
