import React, { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "./NaverLink.module.css";
import naverLogo from "../../assets/images/naver.png";
import { AuthContext } from "../../AuthProvider";

function NaverLink() {
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const isRequestSent = useRef(false); // 요청 중복 방지 상태를 추적

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const uuid = localStorage.getItem("uuid");

    if (!uuid) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }

    if (!code) {
      alert("네이버 인증 코드가 없습니다.");
      navigate("/error");
      return;
    }

    const sendCodeToServer = async () => {
      if (isRequestSent.current) return; // 이미 요청이 전송되었으면 중단
      isRequestSent.current = true; // 요청 상태를 설정

      try {
        const response = await secureApiRequest("/naver/link", {
          method: "POST",
          body: JSON.stringify({ code, uuid }),
        });

        console.log("Axios 응답 성공:", response);

        const responseData = response.data;
        if (response.status === 200 || responseData.success === "true") {
          alert(responseData.message || "네이버 연동 성공했습니다.");
          navigate("/updateUser");
        } else {
          alert(responseData.error || "네이버 연동에 실패했습니다.");
        }
      } catch (error) {
        console.error("네이버 연동 처리 오류:", error);
        alert("네이버 연동에 실패했습니다. 다시 시도해주세요.");
        navigate("/updateUser");
      }
    };

    sendCodeToServer();
  }, [navigate, secureApiRequest]);

  return (
    <div className={style.container}>
      <img src={naverLogo} className={style.naverLogo} alt="네이버 로고" />
      <div>네이버 연동 처리 중...</div>
    </div>
  );
}

export default NaverLink;
