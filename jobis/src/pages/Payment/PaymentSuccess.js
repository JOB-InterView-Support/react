import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./PaymentSuccess.module.css"

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    // TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
    // @docs https://docs.tosspayments.com/reference/using-api/api-keys
    const secretKey = "test_sk_26DlbXAaV010Y4KdE0bqrqY50Q9R";

    // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
    // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
    // @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
    const encryptedSecretKey = `Basic ${btoa(secretKey + ":")}`;

    async function confirm() {
      const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
        method: "POST",
        headers: {
          Authorization: encryptedSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      console.log("response.body" + response.body);
      console.log("orderId:", searchParams.get("orderId"));
      console.log("amount:", searchParams.get("amount"));
      console.log("paymentKey:", searchParams.get("paymentKey"));
      const json = await response.json();
      console.log("json : " + JSON.stringify(json))

      if (!requestData.status === "DONE") {
        // 구매 실패 시
        console.log(json);
        navigate(`/fail?code=${json.code}&message=${json.message}`);
    }else if(requestData.status === "DONE")
      
    // 결제 성공 비즈니스 로직을 구현하세요.
    // console.log(json);
    console.log('결제 성공 했음')
    return json;
    
    }
    confirm().then((data) => {
      setResponseData(data);
    });
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
        <div className={styles.paymentBox}>
          <Link to="https://docs.tosspayments.com/guides/payment-widget/integration">
            <button className={styles.paymentBox}>연동 문서</button>
          </Link>
          <Link to="https://discord.gg/A4fRFXQhRu">
            <button className={styles.paymentBox} >
              실시간 문의
            </button>
          </Link>
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