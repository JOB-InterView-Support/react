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
  const [userName, setUserName] = useState(null); // 사용자 이름 상태

  // 날짜 포맷팅 함수
  function formatDateTime(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  }

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const storedUserName = localStorage.getItem("userName"); // 로컬 스토리지에서 userName 가져오기
    setUserName(storedUserName || "알 수 없음"); // userName 상태 업데이트

    console.log("paymentKey:", paymentKey);
    console.log("orderId:", orderId);
    console.log("amount:", amount);

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "결제가 진행 중입니다. 새로고침을 하지 말아주세요.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

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

          // 응답 데이터를 백엔드로 전송
          return apiClient.post(
            "/api/payments/save",
            {
              ...response.data,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // AccessToken 추가
                RefreshToken: `Bearer ${refreshToken}`, // RefreshToken 추가
              },
            }
          );
        })
        .then((saveResponse) => {
          console.log("Payment data saved successfully:", saveResponse.data);
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
          window.removeEventListener("beforeunload", handleBeforeUnload);
        });
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [searchParams]);

  return (
    <>
      <div className={styles.paymentContainer}>
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          alt="결제 완료"
        />
        <h1 className={styles.paymentTitle}>결제 완료 내역</h1>
        <div className={styles.paymentBox}>
          <table className={styles.paymentTable}>
            <tbody>
              <tr>
                <th>선택한 이용권</th>
                <td>{responseData?.orderName || "-"}</td>
              </tr>
              <tr>
                <th>상품 내용</th>
                <td>자기소개서 분석 + AI 모의면접 + AI 면접 채점&풀이 제공</td>
              </tr>
              <tr>
                <th>결제 방식</th>
                <td>
                  {responseData?.method} / {responseData?.easyPay?.provider || "-"}
                </td>
              </tr>
              <tr>
                <th>결제자</th>
                <td>{userName || "알 수 없음"}</td>
              </tr>
              <tr>
                <th>결제 금액</th>
                <td>
                  {responseData?.totalAmount
                    ? `${Number(responseData.totalAmount).toLocaleString()}원`
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>결제 번호</th>
                <td>{responseData?.paymentKey || "-"}</td>
              </tr>
              <tr>
                <th>결제일자</th>
                <td>{formatDateTime(responseData?.approvedAt) || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton}>환불 진행</button>
          <button
            className={styles.backButton}
            onClick={() => (window.location.href = "http://localhost:8080")}
          >
            돌아가기
          </button>
        </div>

        {isRequesting && <p>결제를 확인 중입니다...</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </>
  );
}

export default PaymentSuccess;

    {/*<div className={styles.paymentBox} style={{ width: "600px", textAlign: "left" }}>
      <b>Response Data :</b>
      <div id="response">
        {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
    </div>*/}
