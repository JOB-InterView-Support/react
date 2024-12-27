import React, { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "./GoogleLink.module.css";
import googleLogo from "../../assets/images/google.png";
import { AuthContext } from "../../AuthProvider";

function GoogleLink() {
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const isRequestSent = useRef(false); // 요청 상태를 추적

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const uuid = localStorage.getItem("uuid");

    if (!uuid) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }

    if (!code) {
      alert("Google 인증 코드가 없습니다.");
      navigate("/error");
      return;
    }

    const sendCodeToServer = async () => {
      if (isRequestSent.current) return; // 요청 중복 방지
      isRequestSent.current = true; // 요청 시작

      try {
        const response = await secureApiRequest("/google/link", {
          method: "POST",
          body: JSON.stringify({ code, uuid }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = response.data;
        if (response.status === 200) {
          alert(responseData.message || "Google 이메일 연동이 성공적으로 완료되었습니다.");
          navigate("/updateUser");
        } else {
          alert(responseData.error || "Google 이메일 연동에 실패했습니다.");
        }
      } catch (error) {
        console.error("Google 연동 처리 오류:", error);
        alert("Google 연동에 실패했습니다. 다시 시도해주세요.");
        navigate("/updateUser");
      }
    };

    sendCodeToServer();
  }, [navigate, secureApiRequest]);

  return (
    <div className={style.container}>
      <img src={googleLogo} className={style.googleLogo} alt="Google 로고" />
      <div>Google 연동 처리 중...</div>
    </div>
  );
}

export default GoogleLink;
