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
    const [userName, setUserName] = useState(null); // 사용자 이름 상태
    const [userDefaultEmail, setUserDefaultEmail] = useState(null); // 사용자 이름 상태
    const [userPhone, setUserPhone] = useState(null); // 사용자 이름 상태

    
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
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // 인증 헤더에 AccessToken 추가
                        refreshToken: `Bearer ${refreshToken}`, // 인증 헤더에 RefreshToken 추가
                    },
                });
                
                console.log("request Authorization : ", accessToken);
                console.log("request refreshToken : ", refreshToken);

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
        const storedUserName = localStorage.getItem("userName"); // 로컬 스토리지에서 userName 가져오기
        const storedUserEmail = localStorage.getItem("userDefaultEmail"); // 로컬 스토리지에서 userName 가져오기
        const storedUserPhone = localStorage.getItem("userPhone");
        setUserName(storedUserName || "알 수 없음"); // userName 상태 업데이트
        setUserDefaultEmail(storedUserEmail || "알 수 없음"); // userEmail 상태 업데이트
        setUserPhone(storedUserPhone || "알 수 없음")
        const sanitizedPhone = storedUserPhone ? storedUserPhone.replace(/-/g, "") : "01000000000"; // 하이픈 제거

        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");    

        if (!payment) {
            console.error("Payment instance is not ready");
            return;
        }
    
        try {
            const response = await apiClient.post(
                "/api/payments/request",
                {
                    orderId: `ORDER_${product.prodNumber}_${Date.now()}`,
                    orderName: product.prodName,
                    amount: product.prodAmount,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // 인증 헤더에 AccessToken 추가
                        refreshToken: `Bearer ${refreshToken}`, // 인증 헤더에 RefreshToken 추가
                    },
                }
            );
    
            if (response.status === 200) {
                // Toss Payments로 결제 진행
                await payment.requestPayment({
                    method: "CARD",
                    amount: {
                        currency: "KRW",
                        value: product.prodAmount,
                    },
                    orderId: `ORDER_${product.prodNumber}_${Date.now()}`,
                    orderName: product.prodName,
                    successUrl: window.location.origin + "/paymentSuccess",
                    failUrl: window.location.origin + "/payments/fail",
                    customerEmail: userDefaultEmail,
                    customerName: userName,
                    customerMobilePhone: sanitizedPhone,
                });
            }
        } catch (error) {
            console.error("Error details:", error); // 전체 에러 객체를 출력
            if (error.response) {
                console.log("Response data:", error.response.data); // 응답 데이터 확인
                console.log("Response status:", error.response.status); // 상태 코드 확인
        
                const errorField = error.response.data.error || ""; // error 필드 가져오기
                const statusCode = errorField.split(" ")[0]; // error 필드에서 첫 번째 단어 추출
        
                if (statusCode === "409") { // 상태 코드 확인
                    alert("이용권을 이미 가지고 있습니다."); // 메시지 출력
                } else {
                    console.error("Error message:", error.response.data.message || "Unknown error");
                    alert("결제 요청에 실패했습니다. 관리자에게 문의하세요.");
                }
            } else {
                alert("결제를 취소하였습니다.")
                return;
            }
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
                {role == "ADMIN" &&(
                       <button onClick={() => '#' }>이용권 등록</button>
                )}
                </div>
        </div>
    );
    
}

export default TicketList;