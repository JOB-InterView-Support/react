import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import React, { useEffect, useState,  useContext  } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from "../../utils/axios";
import TicketSubMenubar from "../../components/common/subMenubar/TicketSubMenubar";

import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import { useNavigate } from "react-router-dom";
import styles from './TicketList.module.css';

function TicketList() {
    const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);  
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // Products 정보를 담을 상태
    const [amount, setAmount] = useState(); // 결제 금액
    const [orderName, setOrderName] = useState();
    const [orderId, setOrderId] = useState();
  

    const [payment, setPayment] = useState(null);
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); // 로그인 페이지로 이동
        }
    }, [isLoggedIn,  navigate]);
    
    

    useEffect(() => {
        // Products 데이터 가져오기
        async function fetchProducts() {
            setIsLoading(true);
            try {
                const accessToken = localStorage.getItem("accessToken");
                const refreshToken = localStorage.getItem("refreshToken");
                
                const response = await apiClient.get("/products",  {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // 인증 헤더에 AccessToken 추가
                        refreshToken: `Bearer ${refreshToken}`, // 인증 헤더에 RefreshToken 추가
                    },
                });
                
                
                if (Array.isArray(response.data)) {
                    const validatedProducts = response.data.map((product) => ({
                        ...product,
                        prodAmount: Number(product.prodAmount), // 보정
                    }));
                    setProducts(validatedProducts);
                } else {
                    console.error("API response is not an array:", response.data);
                }
                console.log("products " + JSON.stringify(products) );
                console.log("response " + JSON.stringify(response.data) );
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        } fetchProducts();
    }, []);
    
    async function handlePayment(product) {
        try {
            // 토큰 가져오기
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
    
            console.log("AccessToken:", localStorage.getItem("accessToken"));
            console.log("RefreshToken:", localStorage.getItem("refreshToken"));
            
    
            if (!accessToken || !refreshToken) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }
    
            const paymentKey = `tviva${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
            // 결제 정보 API 호출
            const response = await fetch("/api/payments/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    refreshToken: `Bearer ${refreshToken}`,
                },
                body: JSON.stringify({
                    paymentKey,
                    amount: product.prodAmount,
                    orderId: `ORDER_${product.prodNumber}_${Date.now()}`,
                    orderName: product.prodName,
                }),
            });
    
            const result = await response.json();
    
            if (result.success) {
                // TossPayments SDK 로드
                const tossPayments = await loadTossPayments("test_ck_BX7zk2yd8yLNpMR6DEQLrx9POLqK");
    
                // 결제 요청
                tossPayments.requestPayment("카드", {
                    paymentKey: result.paymentKey, // 서버에서 받은 paymentKey
                    orderId: result.orderId, // 서버에서 받은 orderId
                    amount: result.amount, // 결제 금액
                    orderName: result.orderName, // 주문 이름
                }).then((paymentStatus) => {
                    if (paymentStatus.status === "DONE") {
                        alert("결제 성공!");
                        window.location.href = "/success";
                    } else {
                        alert("결제 실패: " + paymentStatus.status);
                        window.location.href = "/fail";
                    }
                }).catch((error) => {
                    console.error("결제 실패:", error);
                    alert("결제 실패");
                    window.location.href = "/fail";
                });
            } else {
                alert("결제 정보 오류");
                window.location.href = "/fail";
            }
        } catch (error) {
            console.error("결제 처리 중 오류 발생:", error);
            alert("결제 중 오류가 발생했습니다.");
            window.location.href = "/fail";
        }
    }

    if (isLoading) {
        return <div className={styles.loading}>로딩 중...</div>; // 로딩 표시
      }
    return(
        <div>
            <TicketSubMenubar/>
                <div className={styles.ticketContainer}>
                    {isLoading ? (
                        <p>상품 정보를 불러오는 중입니다...</p>
                    ) : (
                        products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.prodNumber} className={styles.content}>
                                    <h3>{product.prodPeriod}</h3>
                                    <h4>{product.prodName}</h4>
                                    <p>{product.prodDescription}</p>
                                    <h2>{product.prodAmount} 원</h2>
                                    <button onClick={() => handlePayment(product)}>구매하기</button>
                                </div>
                            ))
                        ) : (
                            <p>상품이 없습니다.</p>
                        )
                    )}
                </div>
        </div>
    );
            {/* {role === Admin &&(
                <button onClick={() => InsertProducts }>이용권 등록</button>
            )} */}
    
}

export default TicketList;