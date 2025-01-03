import { useSearchParams } from "react-router-dom";
import styles from "./PaymentSuccess.module.css";


export function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    
    // URL에서 결제 정보 가져오기
    const amount = searchParams.get("amount");
    const orderId = searchParams.get("orderId");
    const paymentKey = searchParams.get("paymentKey");

  return (
    <div className={styles.paymentContainer} style={{ width: "600px" }}>
      <img
        width="100px"
        src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
        alt="결제 성공"
      />
      <h2>결제를 완료했어요</h2>
      <div className={styles.paymentBox} style={{ marginTop: "50px" }}>
        <div className={styles.paymentBox}>
          <b>결제 금액</b>
        </div>
        <div className={styles.paymentBox} id="amount">
          {amount ? `${Number(amount).toLocaleString()}원` : "정보 없음"}
        </div>
      </div>
      <div className={styles.paymentBox}>
        <div className={styles.paymentBox}>
          <b>주문 번호</b>
        </div>
        <div className={styles.paymentBox} id="orderId">
          {orderId || "정보 없음"}
        </div>
      </div>
      <div className={styles.paymentBox}>
        <div className={styles.paymentBox}>
          <b>결제 번호</b>
        </div>
        <div className={styles.paymentBox} id="paymentKey">
          {paymentKey || "정보 없음"}
        </div>
      </div>
    </div>
  );
}
export default PaymentSuccess;