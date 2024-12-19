import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./AdminMemberManagement.module.css";
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";
import Paging from "../../components/common/Paging";

function AdminMemberManagement() {
  const { role, isLoggedIn, secureApiRequest } = useContext(AuthContext); // secureApiRequest 가져오기
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoggedIn || role !== "ADMIN") {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/login");
    }
  }, [role, isLoggedIn, navigate]);

  const fetchData = async (page) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role === "ADMIN") {
      fetchData(currentPage);
    }
  }, [role, currentPage]);

  return (
    <div>
      <AdminSubMenubar />
      <div className={styles.container}>
        <h2>회원관리</h2>
        {isLoading ? (
          <p>데이터를 불러오는 중입니다...</p>
        ) : (
          <>
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
                  <tr
                    key={member.uuid}
                    onClick={() =>
                      navigate("/adminMemberDetail", {
                        state: { uuid: member.uuid },
                      })
                    } // state 전달
                  >
                    <td>{member.userName}</td>
                    <td>{member.userId}</td>
                    <td>{member.userDefaultEmail}</td>
                    <td>{member.userCreateAt.split("T")[0]}</td>
                    <td>
                      {member.userRestrictionStatus === "Y" ? "정지" : "이용중"}
                    </td>
                    <td>{member.adminYn === "Y" ? "관리자" : "일반"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Paging
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => fetchData(page)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminMemberManagement;
