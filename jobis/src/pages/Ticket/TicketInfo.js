import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./TicketInfo.module.css"; // CSS Modules
import Paging from "../../components/common/Paging"; // Paging 컴포넌트 임포트
import TicketSubMenubar from "../../components/common/subMenubar/TicketSubMenubar";


function TicketInfo() {
  const { isLoggedIn, isAuthInitialized, secureApiRequest, role } =
    useContext(AuthContext);
  const [productList, setProductList] = useState([]); // 상품 리스트 상태
  const [totalItems, setTotalItems] = useState(0); // 전체 아이템 수 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태 관리
  const [selectedProduct, setSelectedProduct] = useState(null); // 선택된 상품
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [checkedProducts, setCheckedProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    prodName: "",
    prodDescription: "",
    prodAmount: "",
    prodPeriod: "",
    prodNumberOfTime: "",
  }); // 상품 등록 데이터 상태

  const navigate = useNavigate();
  const itemsPerPage = 10; // 한 페이지에 보여줄 아이템 수

  // 상품 목록 데이터 가져오기
  const fetchProductList = async (page = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await secureApiRequest(`/products/manage?page=${page}&size=${itemsPerPage}`, {
        method: "GET",
      });

      setProductList(response.data.content || []); // 상품 데이터 설정
      setTotalItems(response.data.totalElements || 0); // 전체 아이템 수 설정
      setCurrentPage(page); // 현재 페이지 설정 (0 기반)
    } catch (err) {
      console.error("상품 목록 로드 실패:", err);
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 첫 번째 페이지 데이터 로드
  useEffect(() => {
    if (!isAuthInitialized && !isLoggedIn) {
      console.log("로그인되지 않은 상태입니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } else {
      fetchProductList(0); // 초기 로드 시 첫 번째 페이지 (0 기반)
    }
  }, [isLoggedIn, isAuthInitialized, navigate]);

  const handlePageChange = (page) => {
    fetchProductList(page); // 페이지 변경 시 데이터 가져오기 (0 기반)
  };

  // 상품 등록 모달 열기/닫기
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 상품 등록 데이터 입력 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product); // 클릭한 상품 데이터를 설정
    setIsEditModalOpen(true); // 수정 모달 열기
  };

  // 상품 등록 처리
  const handleRegisterProduct = async () => {
    try {
      const response = await secureApiRequest("/products/insert", {
        method: "POST",
        data: {
          ...newProduct,
          prodSellable: "N",
        },
      });

      if (response.status === 201) {
        alert("상품이 성공적으로 등록되었습니다.");
        setProductList((prev) => [...prev, response.data]); // 상품 리스트 갱신
        handleCloseModal();
      }
    } catch (error) {
      console.error("상품 등록 중 오류 발생:", error);
      alert("상품 등록에 실패했습니다.");
    }
  };

  const handleSellableChange = async (prodNumber, isChecked) => {
    const updatedCheckedProducts = isChecked
      ? [...checkedProducts, prodNumber] // 체크된 상품 추가
      : checkedProducts.filter((id) => id !== prodNumber); // 체크 해제
  
    if (updatedCheckedProducts.length > 3) {
      alert("등록할 수 있는 상품은 3개 까지 입니다.");
      return; // 체크 상태를 변경하지 않음
    }
  
    try {
      const sellable = isChecked ? "Y" : "N";
      await secureApiRequest(`/products/${prodNumber}/sellable?sellable=${sellable}`, {
        method: "PATCH",
      });
  
      setProductList((prevList) =>
        prevList.map((product) =>
          product.prodNumber === prodNumber ? { ...product, prodSellable: sellable } : product
        )
      );
      setCheckedProducts(updatedCheckedProducts); // 상태 업데이트
    } catch (error) {
      console.error("Failed to update product sellable:", error);
      alert("상태를 업데이트하는 중 문제가 발생했습니다.");
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false); // 수정 모달 닫기
    setSelectedProduct(null); // 선택된 상품 초기화
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleEditSubmit = async () => {
    try {
      // prodNumberOfTime 값 변환
      selectedProduct.prodNumberOfTime = parseInt(selectedProduct.prodNumberOfTime, 10);
  
      console.log("Request Data:", JSON.stringify(selectedProduct));
      // secureApiRequest의 응답을 변수에 저장
      const response = await secureApiRequest(`/products/updateProd/${selectedProduct.prodNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProduct),
      });
      console.log("selectProduct : ", selectedProduct);
      // 응답 상태 확인
      if (response.status === 200) {
        alert("상품 정보가 성공적으로 수정되었습니다.");
        handleEditModalClose();
        fetchProductList(currentPage); // 수정 후 목록 갱신
      } else {
        console.log("selectProduct : ", selectedProduct);
        alert(`상품 수정 실패: ${response.statusText}`);
      }
    } catch (error) {
      console.log("selectProduct : ", selectedProduct);
      console.error("Error occurred:", error);
      alert("상품 수정에 실패했습니다.");
    }
  };

  return (
    <div className={styles.noticecontainer}>
       <TicketSubMenubar/>
      <h2 className={styles.noticetitle}>상품 관리</h2>
      {error && <div className={styles.errorMessage}>{error}</div>} {/* 에러 메시지 표시 */}
      {isLoading && <div className={styles.loadingMessage}>로딩 중...</div>} {/* 로딩 상태 표시 */}
      <table className={styles.noticetable}>
        <thead>
          <tr>
            <th>No</th>
            <th>상품명</th>
            <th>설명</th>
            <th>가격(원)</th>
            <th>기간</th>
            <th>판매 여부</th>
            <th>사용 가능 횟수</th>
          </tr>
        </thead>
          <tbody>
            {productList.length > 0 ? (
              productList.map((product, index) => (
                <tr
                key={product.prodNumber}
                className={styles.noticerow}
                onClick={() => handleProductClick(product)}
                >
                  <td>{index + 1 + currentPage * itemsPerPage}</td>
                  <td>{product.prodName}</td>
                  <td>{product.prodDescription}</td>
                  <td>{product.prodAmount}</td>
                  <td>{product.prodPeriod}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={product.prodSellable === "Y"}
                      onChange={(e) => handleSellableChange(product.prodNumber, e.target.checked)}
                      onClick={(e) => e.stopPropagation()} 
                    />
                  </td>
                  <td>{product.prodNumberOfTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">상품 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
      </table>
      <Paging
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage + 1} // 0 기반 -> 1 기반으로 변환
        onPageChange={(page) => handlePageChange(page - 1)} // 1 기반 -> 0 기반으로 변환
      />
      {role === "ADMIN" && (
        <div>
          <button onClick={handleOpenModal} className={styles.insertButton}>
            상품 등록
          </button>
          {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>상품 등록</div>
              <div className={styles.modalBody}>
                <label>상품명</label>
                <input
                  type="text"
                  name="prodName"
                  value={newProduct.prodName}
                  onChange={handleChange}
                />
                <label>설명</label>
                <textarea
                  name="prodDescription"
                  value={newProduct.prodDescription}
                  onChange={handleChange}
                />
                <label>가격(원)</label>
                <input
                  type="number"
                  name="prodAmount"
                  value={newProduct.prodAmount}
                  onChange={handleChange}
                />
                <label>기간</label>
                <input
                  type="text"
                  name="prodPeriod"
                  value={newProduct.prodPeriod}
                  onChange={handleChange}
                />
                <label>사용 가능 횟수</label>
                <input
                  type="number"
                  name="prodNumberOfTime"
                  value={newProduct.prodNumberOfTime}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.modalFooter}>
                <button onClick={handleRegisterProduct} className={styles.saveButton}>
                  등록
                </button>
                <button onClick={handleCloseModal} className={styles.cancelButton}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalHeader}>상품 수정</h3>
              <div className={styles.modalBody}>
                <label>상품명</label>
                <input
                  type="text"
                  name="prodName"
                  value={selectedProduct?.prodName || ""}
                  onChange={handleEditChange}
                />
                <label>설명</label>
                <textarea
                  name="prodDescription"
                  value={selectedProduct.prodDescription}
                  onChange={handleEditChange}
                />
                <label>가격(원)</label>
                <input
                  type="number"
                  name="prodAmount"
                  value={selectedProduct.prodAmount}
                  onChange={handleEditChange}
                />
                <label>기간</label>
                <input
                  type="text"
                  name="prodPeriod"
                  value={selectedProduct.prodPeriod}
                  onChange={handleEditChange}
                />
                <label>사용 가능 횟수</label>
                <input
                  type="number"
                  name="prodNumberOfTime"
                  value={selectedProduct.prodNumberOfTime}
                  onChange={handleEditChange}
                />
                <button onClick={handleEditSubmit} className={styles.saveButton}>저장</button>
                <button onClick={handleEditModalClose} className={styles.cancelButton}>취소</button>
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}

export default TicketInfo;
