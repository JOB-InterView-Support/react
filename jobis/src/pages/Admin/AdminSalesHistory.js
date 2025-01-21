import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import styles from "./AdminSalesHistory.module.css";
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";
import Paging from "../../components/common/Paging";

function AdminSalesHistory() {
  const [salesHistory, setSalesHistory] = useState([]); // 판매 내역 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalItems, setTotalItems] = useState(0); // 전체 데이터 개수
  const [filterOption, setFilterOption] = useState("이름"); // 필터 옵션
  const [searchText, setSearchText] = useState(""); // 검색 텍스트
  const [cancelYN, setCancelYN] = useState(null); // 라디오 버튼 상태
  const itemsPerPage = 10; // 페이지당 항목 수
  const { secureApiRequest } = useContext(AuthContext);

  // 검색 요청 함수
  const fetchSearchResults = async () => {
    try {
      setCurrentPage(1); // 검색 시 페이지를 첫 번째로 설정
      let url = `/admin/salesHistory?page=0&size=${itemsPerPage}&filter=${filterOption}&search=${searchText}`;
      
      // 라디오 버튼에 따른 환불 여부 조건 추가
      if (cancelYN !== null) {
        url += `&cancelYN=${cancelYN}`;
      }
  
      const response = await secureApiRequest(url, { method: "GET" });
      setSalesHistory(response.data.content || []);
      setTotalItems(response.data.totalElements || 0);
      console.log("검색 결과:", response.data);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };
  

  // 판매 내역 가져오기
  const fetchSalesHistory = async (page) => {
    try {
      let url = `/admin/salesHistory?page=${page - 1}&size=${itemsPerPage}`;
      if (cancelYN !== null) {
        url += `&cancelYN=${cancelYN}`;
      }
      const response = await secureApiRequest(url, { method: "GET" });
      setSalesHistory(response.data.content || []);
      setTotalItems(response.data.totalElements || 0);
      console.log("판매 내역:", response.data);
    } catch (error) {
      console.error("판매 내역 조회 실패:", error);
    }
  };

  // 첫 렌더링 및 필터 변경 시 데이터 가져오기
  useEffect(() => {
    fetchSalesHistory(currentPage);
  }, [currentPage, cancelYN]);

  return (
    <div>
      <AdminSubMenubar />
      <div className={styles.container}>
        <h1>판매 내역</h1>
        <div className={styles.filterContainer}>
          <div className={styles.arrayGroup}>
            <label>
              <input
                type="radio"
                name="filter"
                value="전체"
                defaultChecked
                onChange={() => {
                  setCancelYN(null);
                  setSearchText(""); // 검색 텍스트 초기화
                  setCurrentPage(1); // 페이지를 처음으로 이동
                }}
              />
              전체
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="판매"
                onChange={() => {
                  setCancelYN("N");
                  setSearchText(""); // 검색 텍스트 초기화
                  setCurrentPage(1); // 페이지를 처음으로 이동
                }}
              />
              판매
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="환불"
                onChange={() => {
                  setCancelYN("Y");
                  setSearchText(""); // 검색 텍스트 초기화
                  setCurrentPage(1); // 페이지를 처음으로 이동
                }}
              />
              환불
            </label>
          </div>

          <div className={styles.searchGroup}>
            <select
              className={styles.selectOpt}
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="이름">이름</option>
              <option value="상품명">상품명</option>
            </select>
            <input
              type="text"
              className={styles.searchText}
              placeholder="검색어를 입력하세요"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className={styles.searchButton}
              onClick={fetchSearchResults} // 버튼 클릭 시 검색 실행
            >
              
            </button>
          </div>
        </div>
        <div className={styles.content}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>상품번호</th>
                <th>상품명</th>
                <th>구매자</th>
                <th>통화 종류</th>
                <th>총 결제 금액</th>
                <th>결제 처리 상태</th>
                <th>결제 요청 날짜</th>
                <th>결제 승인 날짜</th>
                <th>환불 여부</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.length > 0 ? (
                salesHistory.map((history, index) => (
                  <tr key={index}>
                    <td>{history.prodNumber}</td>
                    <td>{history.prodName}</td>
                    <td>{history.userName}</td>
                    <td>{history.currency}</td>
                    <td>{history.totalAmount}</td>
                    <td>{history.status}</td>
                    <td>{new Date(history.requestedAt).toLocaleString()}</td>
                    <td>{new Date(history.approvedAt).toLocaleString()}</td>
                    <td>{history.cancelYN === "Y" ? "환불됨" : "환불 안함"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    판매 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Paging
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminSalesHistory;
