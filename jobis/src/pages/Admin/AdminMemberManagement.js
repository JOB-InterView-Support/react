import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./AdminMemberManagement.module.css";
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";
import Paging from "../../components/common/Paging";

function AdminMemberManagement() {
  const { role, isLoggedIn, isAuthInitialized, secureApiRequest } = useContext(AuthContext);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAuthInitialized) {
      console.log("Auth 상태 초기화 중. 대기 중...");
      return;
    }
    if (!isLoggedIn || role !== "ADMIN") {
      alert("관리자만 접근할 수 있습니다.");
      navigate("/login");
    }
  }, [isAuthInitialized, role, isLoggedIn, navigate]);

  useEffect(() => {
    if (!isAuthInitialized || !isLoggedIn || role !== "ADMIN") return;

    let isMounted = true;

    const fetchMembers = async (page) => {
      setIsLoading(true);
      try {
        const response = await secureApiRequest(
          `/admin/adminMemberManagementList?page=${page - 1}&size=${itemsPerPage}`
        );
        if (isMounted) {
          setMembers(response.data.content);
          setTotalItems(response.data.totalElements);
          setCurrentPage(page);
        }
      } catch (error) {
        if (isMounted) {
          console.error("데이터 가져오는 중 오류 발생:", error.message);
          alert(error.response?.data?.message || "데이터를 불러오는 중 문제가 발생했습니다.");
          if (error.response?.status === 401) {
            navigate("/login");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMembers(currentPage);

    return () => {
      isMounted = false;
    };
  }, [isAuthInitialized, isLoggedIn, role, currentPage, secureApiRequest, navigate]);

  return (
    <div>
      <AdminSubMenubar />
      <div className={styles.container}>
        <h2>회원관리</h2>
        {!isAuthInitialized ? (
          <div className={styles.loadingContainer}>
            <p>Auth 상태 초기화 중입니다...</p>
          </div>
        ) : isLoading ? (
          <div className={styles.loadingContainer}>
            <p>데이터를 불러오는 중입니다...</p>
            <div className={styles.spinner}></div>
          </div>
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
                        state: { uuid: member.uuid },
                      })
                    }
                  >
                    <td>{member.userName}</td>
                    <td>{member.userId}</td>
                    <td>{member.userDefaultEmail}</td>
                    <td>{member.userCreateAt.split("T")[0]}</td>
                    <td>{member.userRestrictionStatus === "Y" ? "정지" : "이용중"}</td>
                    <td>{member.adminYn === "Y" ? "관리자" : "일반"}</td>
                    <td>{member.userDeletionStatus === "Y" ? "탈퇴" : "비탈퇴"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Paging
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminMemberManagement;
