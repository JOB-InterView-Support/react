import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./AdminMemberManagement.module.css";
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";
import Paging from "../../components/common/Paging";

function AdminMemberManagement() {
  const { role, isLoggedIn, secureApiRequest } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const page = location.state?.page || 1;
    setCurrentPage(page);
    if (role === "ADMIN") {
      fetchData(page);
    }
  }, [location.state, role]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedRole = localStorage.getItem("role");

    if (accessToken && storedRole === "ADMIN") {
      setIsAuthInitialized(true);
    } else {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response = await secureApiRequest(
        `/admin/adminMemberManagementList?page=${page - 1}&size=${itemsPerPage}`
      );
      setMembers(response.data.content);
      setTotalItems(response.data.totalElements);
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
                  <th>탈퇴 여부</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.uuid}
                    onClick={() =>
                      navigate("/adminMemberDetail", {
                        state: { uuid: member.uuid, page: currentPage },
                      })
                    }
                  >
                    <td>{member.userName}</td>
                    <td>{member.userId}</td>
                    <td>{member.userDefaultEmail}</td>
                    <td>{member.userCreateAt.split("T")[0]}</td>
                    <td>
                      {member.userRestrictionStatus === "Y" ? "정지" : "이용중"}
                    </td>
                    <td>{member.adminYn === "Y" ? "관리자" : "일반"}</td>
                    <td>
                      {member.userDeletionStatus === "Y" ? "탈퇴" : "비탈퇴"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Paging
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchData(page);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminMemberManagement;
