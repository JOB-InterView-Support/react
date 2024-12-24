import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

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

        const { accessToken, refreshToken, userId, userName, role } = data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", userId || "unknown");
        localStorage.setItem("userName", userName || "unknown");
        localStorage.setItem("role", role || "unknown");

        setAuthInfo({
          isLoggedIn: true,
          role: role,
          username: userName,
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

  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoLogin;
