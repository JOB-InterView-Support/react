import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeList.module.css"; // CSS Modules
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
//import InsertButton from "../../components/common/button/InsertButton"; // InsertButton 컴포넌트 임포트

function NoticeList() {
  const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
  const [noticeList, setnoticeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // 에러 상태 관리

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const handleMoveDetail = (no) => {
    navigate(`/notice/detail/${no}`);
  };

  const fetchNoticeList = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await secureApiRequest(`/notice`, {
        method: "GET",
        params: { page, size: itemsPerPage },
      });

      console.log("response : " + JSON.stringify(response.data.list));

      setnoticeList(response.data.list || []);
      setTotalItems(response.data.paging.totalItems || 0);
      setCurrentPage(page);
    } catch {
      setError("데이터 전송 실패");
    } finally {
      //로딩 종료
      setIsLoading(false);
    }
  };

  const handleMoveInsert = () => {
    navigate(`/notice/insert`);
    console.log(
      "handleMoveInsert : " + JSON.stringify(handleMoveInsert.data)
    );
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchNoticeList(currentPage);
    }
  }, [isLoggedIn, navigate]);

  console.log("isLoading:", isLoading);
  console.log("noticeList:", noticeList);

  return (
    <div className={styles.noticecontainer}>
      <h2 className={styles.noticetitle}>공지사항</h2>
      <table className={styles.noticetable}>
        <tbody>
          {noticeList.map((notice) => (
            <tr key={notice.noticeNo}>
              <td>
                <button
                  onClick={() => handleMoveDetail(notice.noticeNo)}
                  className={styles.noticeTbutton}
                >
                  {notice.noticeTitle}
                </button>
              </td>
              <td>{notice.noticeWDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paging
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => fetchNoticeList(page)}
      />
      {role === "ADMIN" && (
        <div className={styles.buttonContainer}>
          <button onClick={handleMoveInsert}>등 록</button>
        </div>
      )}
    </div>
  );
}
export default NoticeList;
