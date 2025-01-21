import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./NaverLogin.module.css";
import naverLogo from "../../assets/images/naver.png";
import apiClient from "../../utils/axios"; // Axios instance를 사용한다고 가정

function NaverLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const sendCodeToBackend = async (code) => {
        try {
            const response = await apiClient.post("/naver/apicode", { code });

            if (response.status === 409) {
                const data = response.data;
                console.warn("등록되지 않은 이메일:", data.email);
                alert("등록되지 않은 이메일입니다. 회원가입 페이지로 이동합니다.");
                navigate("/snsSignup", {
                    state: {
                        email: data.email,
                        snsType: "naver", // Naver SNS 로그인 정보 전달
                    },
                });
                return;
            }

            // 정상 응답 처리
            const { accessToken, refreshToken, userId, userName, role, uuid } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userId", userId || "unknown");
            localStorage.setItem("userName", userName || "unknown");
            localStorage.setItem("role", role || "unknown");
            localStorage.setItem("uuid", uuid || "unknown");

            alert("네이버 로그인이 성공했습니다!");
            navigate("/"); // 메인 페이지로 이동
        } catch (error) {
            if (error.response && error.response.status === 409) {
                const data = error.response.data;
                alert(`등록되지 않은 이메일입니다: ${data.email}`);
                navigate("/snsSignup", {
                    state: {
                        email: data.email,
                        snsType: "naver",
                    },
                });
            } else {
                console.error("네이버 로그인 처리 오류:", error);
                alert("네이버 로그인 처리 중 문제가 발생했습니다.");
            }
        }
    };

    const code = new URLSearchParams(window.location.search).get("code");
    if (code) sendCodeToBackend(code);
}, [navigate]);



  return (
    <div className={style.container}>
      <img src={naverLogo} className={style.naverLogo} alt="Naver Logo" />
      <div>네이버 로그인 처리 중...</div>
    </div>
  );
}

export default NaverLogin;
