import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import style from "./KakaoLogin.module.css";
import kakaoLogo from "../../assets/images/kakaotalk.png";

function KakaoLogin() {
  const navigate = useNavigate();
  const { setAuthInfo } = useContext(AuthContext);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const extractCode = () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      return urlParams.get("code");
    };

    const sendCodeToBackend = async (code) => {
      if (isRequesting) return;
      setIsRequesting(true);

      try {
        const response = await fetch("/kakao/apicode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        console.log("HTTP 응답 상태:", response.status);

        if (response.status === 409) {
          const data = await response.json();
          console.warn("등록되지 않은 이메일:", data.email);
          alert("등록되지 않은 이메일입니다. 회원가입 페이지로 이동합니다.");
          navigate("/snsSignup", {
            state: {
              email: data.email,
              snsType: "kakao", // kakao라는 추가 데이터 전달
            },
          });
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("서버 응답 데이터:", data);

        // 데이터 유효성 검사
        const { accessToken, refreshToken, userId, userName, role, uuid } = data;
        if (!accessToken || !refreshToken || !userId || !userName) {
          throw new Error("필수 데이터가 누락되었습니다.");
        }

        // 로컬 스토리지에 데이터 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId || "unknown");
        localStorage.setItem("userName", userName || "unknown");
        localStorage.setItem("role", role || "unknown");
        localStorage.setItem("uuid", uuid || "unknown"); // UUID 저장

        setAuthInfo({
          isLoggedIn: true,
          role: role,
          username: userName,
          uuid: uuid, // UUID 추가
        });

        alert("카카오 로그인이 성공했습니다.");
        navigate("/"); // 메인 페이지로 이동
      } catch (error) {
        console.error("카카오 로그인 처리 오류:", error);
        alert("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
      } finally {
        if (isMounted) setIsRequesting(false);
      }
    };

    const code = extractCode();
    if (code && !isRequesting) {
      sendCodeToBackend(code);
    }

    return () => {
      isMounted = false;
    };
  }, [navigate, setAuthInfo, isRequesting]);

  return (
    <div className={style.container}>
      <img src={kakaoLogo} className={style.kakaoLogo} alt="Kakao Logo" />
      <div>카카오 로그인 처리 중...</div>
    </div>
  );
}

export default KakaoLogin;
