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

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: parseInt(searchParams.get("amount"), 10), // 숫자로 변환
      paymentKey: searchParams.get("paymentKey"),
    };
    console.log('orderId : ', requestData.orderId);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    if (!BACKEND_URL) {
      console.error("Backend URL is not set. Check your environment configuration.");
      navigate("/fail?code=CONFIG_ERROR&message=환경 설정 오류");
    }
    console.log("BACKEND_URL", BACKEND_URL)

    async function confirm() {
      try {
        const response = await apiClient.post(`/payments/confirm`, requestData)
          
        console.log("response : ", response.data);
  
        if (response.data) {
          console.log("결제 성공:", response.data);
          setResponseData(response.data);
        } else {
          navigate(`/fail?code=${response.data.code}&message=${response.data.message}`);
        }
      } catch (error) {
        console.error("결제 확인 중 오류 발생:", error);
        navigate("/fail?code=ERROR&message=결제 확인 중 오류 발생");
      }
    }

    confirm();
  }, [searchParams, navigate]);
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