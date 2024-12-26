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
     
    useEffect(() => {
        if (!isLoggedIn) {
          navigate("/login"); // 로그인 페이지로 이동
        }
      }, [isLoggedIn,  navigate]);


    const [payment, setPayment] = useState(null);
    const [amount] = useState({
        currency: "KRW",
        value: 50000,
    });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    
    function selectPaymentMethod(method) {
        setSelectedPaymentMethod(method);
    }
    
    useEffect(() => {
        async function fetchPayment() {
            try {
                const tossPayments = await loadTossPayments(clientKey);
                
                // 회원 결제
                // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
                const payment = tossPayments.payment({
                    customerKey,
                });
                // 비회원 결제
                // const payment = tossPayments.payment({ customerKey: ANONYMOUS });
                
                setPayment(payment);
            } catch (error) {
                console.error("Error fetching payment:", error);
            }
        }
        fetchPayment();
    }, [clientKey, customerKey]);
    
    // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
    // @docs https://docs.tosspayments.com/sdk/v2/js#paymentrequestpayment
    async function requestPayment() {
        // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
        // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
        await payment.requestPayment({
            method: "CARD", // 카드 및 간편결제
            amount: amount,
            orderId: "K5C7xjYtjgAYK-4Mbe3S8", // 고유 주문번호
            orderName: "토스 티셔츠 외 2건",
            successUrl: window.location.origin + "/success", // 결제 요청이 성공하면 리다이렉트되는 URL
            failUrl: window.location.origin + "/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
            customerEmail: "customer123@gmail.com",
            customerName: "김토스",
            customerMobilePhone: "01012341234",
            // 카드 결제에 필요한 정보
            card: {
                useEscrow: false,
                flowMode: "DEFAULT", // 통합결제창 여는 옵션
                useCardPoint: false,
                useAppCardOnly: false,
            },
        });
    }

    return(
        <div>
            <TicketSubMenubar/>
            <div className={styles.ticketContainer}>
                <div className={styles.content}>
                    <h3>6개월</h3>
                    <h4>5 + 1회 이용권</h4>
                    <p>자기소개서 분석 <br/>+<br/> AI 모의면접 <br/>+<br/> AI 면접 분석결과 확인</p>
                    <h2>47000 원</h2>
                    <button onClick={() => requestPayment()}>구매하기</button>
                </div>
                <div className={styles.content}>
                    <h3>1개월</h3>
                    <h4>3회 이용권</h4>
                    <p>자기소개서 분석 <br/>+<br/> AI 모의면접 <br/>+<br/> AI 면접 분석결과 확인</p>
                    <h2>25000 원</h2>
                    <button onClick={() => requestPayment()}>구매하기</button>
                </div>
                <div className={styles.content}>
                    <h3>24시간</h3>
                    <h4>1회 이용권</h4>
                    <p>자기소개서 분석 <br/>+<br/> AI 모의면접 <br/>+<br/> AI 면접 분석결과 확인</p>
                    <h2>9900 원</h2>
                    <button onClick={() => requestPayment()}>구매하기</button>
                </div>
            </div>
            {/* {role === Admin &&(
                <button onClick={() => InsertProducts }>이용권 등록</button>
            )} */}
        </div>
    )
}

export default TicketList;