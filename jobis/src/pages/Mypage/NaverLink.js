import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "./NaverLink.module.css";
import naverLogo from "../../assets/images/naver.png";
import { AuthContext } from "../../AuthProvider";

function NaverLink() {
  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext); // 인증 요청에 사용

  useEffect(() => {
    let isMounted = true; // 컴포넌트가 마운트된 상태를 추적

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const uuid = localStorage.getItem("uuid"); // 로컬스토리지에서 uuid 가져오기

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

    const sendCodeToServer = async (code, uuid) => {
      if (!isMounted) return; // 컴포넌트가 언마운트되었으면 요청 중단

      try {
        const response = await secureApiRequest("/naver/link", {
          method: "POST",
          body: JSON.stringify({ code, uuid }),
        });

        console.log("Axios 응답 성공:", response);

        const responseData = response.data; // JSON 데이터 접근
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

    sendCodeToServer(code, uuid);

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 상태 업데이트 방지
    };
  }, [navigate, secureApiRequest]);

  return (
    <div className={style.container}>
      <img src={naverLogo} className={style.naverLogo} alt="네이버 로고" />
      <div>네이버 연동 처리 중...</div>
    </div>
  );
}

export default NaverLink;
