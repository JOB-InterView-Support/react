import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./PaymentSuccess.module.css"
import { AuthContext } from "../../AuthProvider"
import apiClient from "../../utils/axios";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const { secureApiRequest } = useContext(AuthContext);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    console.log("paymentKey:", paymentKey);
    console.log("orderId:", orderId);
    console.log("amount:", amount);

    if (paymentKey && orderId && amount) {
      setIsRequesting(true); // 요청 중 상태 활성화
      setErrorMessage(null); // 에러 메시지 초기화
      
      apiClient
        .post(  "/api/payments/confirm",
          {
            paymentKey,
            orderId,
            amount: Number(amount),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // AccessToken 추가
              RefreshToken: `Bearer ${refreshToken}`, // RefreshToken 추가
            },
            
          }
          
        )
        .then((response) => {
          console.log("Payment confirmed:", response.data);
          setResponseData(response.data); // 응답 데이터 저장
        })
        .catch((error) => {
          console.log("AccessToken:", localStorage.getItem("AccessToken"));
          console.log("RefreshToken:", localStorage.getItem("RefreshToken"));
          console.error("Error confirming payment:", error);
          setErrorMessage(
            "결제 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        })
        .finally(() => {
          setIsRequesting(false); // 요청 완료 상태로 변경
        });
    }
  }, [searchParams]);
  return (
    <>
      <div className={styles.paymentContainer} style={{ width: "600px" }}>
        <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" />
        <h2>결제를 완료했어요</h2>
        <div className={styles.paymentBox} style={{ marginTop: "50px" }}>
          <div className={styles.paymentBox}>
            <b>결제금액</b>
          </div>
          <div className={styles.paymentBox} id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className={styles.paymentBox} >
          <div className={styles.paymentBox}>
            <b>주문번호</b>
          </div>
          <div className={styles.paymentBox} id="orderId">
            {`${searchParams.get("orderId")}`}
          </div>
        </div>
        <div className={styles.paymentBox} >
          <div className={styles.paymentBox}>
            <b>결제 번호</b>
          </div>
          <div className={styles.paymentBox} id="paymentKey" >
            {`${searchParams.get("paymentKey")}`}
          </div>
        </div>
            {isRequesting && <p>결제를 확인 중입니다...</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      <div className={styles.paymentBox} style={{ width: "600px", textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response">
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}  
export default PaymentSuccess;