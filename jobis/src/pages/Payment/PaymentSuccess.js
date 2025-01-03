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
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    // 중복 요청 방지 조건을 다시 한번 명확히
    const confirm = async () => {
      // 요청 중이면 중복 실행되지 않도록 한다
      if (isRequesting) {
        console.log("이미 요청 중입니다.");
        return;
      }
  
      // 요청 시작 전, 상태를 설정하여 중복 요청을 방지
      setIsRequesting(true);
  
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: parseInt(searchParams.get("amount"), 10),
        paymentKey: searchParams.get("paymentKey"),
      };
      console.log("requestData : ", requestData);
  
      try {
        const response = await apiClient.post(`/payments/confirm`, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("response : ", response.data);
      
        // 응답 데이터 확인 및 처리
        if (response.status === 200 && response.data.status === "DONE") {
          setResponseData(response.data);
          return;
        } else {
          console.warn("Unexpected response:", response.data);
          console.log("useEffect 실행됨");
          navigate("/fail?code=INVALID_RESPONSE&message=Unexpected response");
        }
      } catch (error) {
        console.error("결제 확인 중 오류 발생:", error.response || error);
        const message = error.response?.data?.message || "결제 확인 중 오류 발생";
        console.log("useEffect 실행됨");
        navigate(`/fail?code=ERROR&message=${encodeURIComponent(message)}`);
      } finally {
        // 요청이 끝나면 상태를 다시 false로 설정
        setIsRequesting(false);
      }
    };
  
    // 비동기 작업이 실행되도록 confirm 호출
    confirm();
  }, [searchParams, navigate, isRequesting]); // isRequesting을 의존성 배열에 넣어서 상태 변경 시에만 실행되도록 함


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