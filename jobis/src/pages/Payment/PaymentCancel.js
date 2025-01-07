import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./PaymentSuccess.module.css";
import { AuthContext } from "../../AuthProvider";
import apiClient from "../../utils/axios";

export function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const { secureApiRequest } = useContext(AuthContext);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    console.log("paymentKey:", paymentKey);

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "결제 취소가 진행 중입니다. 새로고침을 하지 말아주세요.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    if (paymentKey) {
      setIsRequesting(true); // 요청 중 상태 활성화
      setErrorMessage(null); // 에러 메시지 초기화

      apiClient
        .post(
          `/v1/payments/${paymentKey}/cancel`,
          {
            cancelReason: "구매자가 취소를 원함",
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
          console.log("Payment canceled:", response.data);
          setResponseData(response.data); // 응답 데이터 저장
        })
        .catch((error) => {
          console.error("Error canceling payment:", error);
          setErrorMessage(
            "결제 취소 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
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
          alt="결제 취소"
        />
        <h1 className={styles.paymentTitle}>결제 취소 내역</h1>
        <div className={styles.paymentBox}>
          <table className={styles.paymentTable}>
            <tbody>
              <tr>
                <th>결제 번호</th>
                <td>{responseData?.paymentKey || "-"}</td>
              </tr>
              <tr>
                <th>취소 사유</th>
                <td>구매자가 취소를 원함</td>
              </tr>
              <tr>
                <th>취소일자</th>
                <td>{responseData?.canceledAt || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.backButton}
            onClick={() => (window.location.href = "http://localhost:8080")}
          >
            돌아가기
          </button>
        </div>

        {isRequesting && <p>결제를 취소 중입니다...</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </>
  );
}

export default PaymentCancel;
