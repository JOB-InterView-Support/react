import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import React, { useEffect, useState,  useContext  } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from "../../utils/axios";
import TicketSubMenubar from "../../components/common/subMenubar/TicketSubMenubar";

import { AuthContext } from "../../AuthProvider"; // AuthProvider에서 Context 가져오기
import { useNavigate } from "react-router-dom";
import styles from './TicketList.module.css';

// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_ck_BX7zk2yd8yLNpMR6DEQLrx9POLqK";
const customerKey = "7HUxbkFLek_EdGokYd3Cb";

function TicketList() {
    const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);  
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // Products 정보를 담을 상태
    

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
    
   
    
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    
    function selectPaymentMethod(method) {
        setSelectedPaymentMethod(method);
    }
    
    useEffect(() => {
        let isMounted = true; // 플래그 추가
        async function fetchPayment() {
            if (!isMounted) return; // 이미 처리된 경우 실행 방지
            try {
                const tossPayments = await loadTossPayments(clientKey);
                const payment = tossPayments.payment({ customerKey });
                setPayment(payment);
            } catch (error) {
                console.error("Error fetching payment:", error);
            }
        }
        fetchPayment();
        return () => { isMounted = false }; // 클린업
    }, [clientKey, customerKey]);
    
    // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
    // @docs https://docs.tosspayments.com/sdk/v2/js#paymentrequestpayment
    async function requestPayment(product) {
        console.log("Product data for payment:", product); // product 객체 출력
        if (!payment) {
            console.error("Payment instance is not ready");
            return;
        }

          // amount 객체 생성
        const amount = {
            currency: "KRW",
            value: product.prodAmount, // 개별 product의 금액 설정
        };

        try {
            await payment.requestPayment({
                method: "CARD",
                amount:  amount,  // 개별 product의 금액
                orderId: `ORDER_${product.prodNumber}_${Date.now()}`,
                orderName: product.prodName,
                successUrl: window.location.origin + "/paymentSuccess",
                failUrl: window.location.origin + "/payments/fail",
                customerEmail: "customer123@gmail.com",
                customerName: "김토스",
                customerMobilePhone: "01012341234",
                card: {
                    useEscrow: false,
                    flowMode: "DEFAULT",
                    useCardPoint: false,
                    useAppCardOnly: false,
                },
            });
            console.log(typeof(orderId));
        } catch (error) {
            console.error("Payment request failed:", error);
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
                                    <button onClick={() => requestPayment(product)}>구매하기</button>
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