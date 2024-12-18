import React, { createContext, useState, useEffect } from "react";
import apiClient from "../src/utils/axios"; // apiClient 가져오기

export const AuthContext = createContext();

const parseAccessToken = (token) => {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
};

export const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState({
    isLoggedIn: false,
    role: "",
    username: "",
  });

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");
  
      const response = await apiClient.post("/reissue", null, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
  
      const newAccessToken = response.headers["authorization"].split(" ")[1];
      const newRefreshToken = response.headers["refresh-token"].split(" ")[1];
  
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
  
      const parsedToken = parseAccessToken(newAccessToken);
  
      setAuthInfo({
        isLoggedIn: true,
        role: parsedToken.role,
        username: parsedToken.userName,
      });
    } catch (error) {
      console.error("Failed to refresh token:", error);
  
      if (error.response && error.response.status === 401) {
        // Java가 RefreshToken이 만료되었음을 응답하면
        alert("Refresh Token이 만료되었습니다. 다시 로그인해주세요.");
        logoutAndRedirect(); // 세션 초기화 및 로그인 페이지로 이동
      } else {
        console.error("예상치 못한 오류:", error.message);
      }
    }
  };
  
  
  // 로그아웃 함수
  const logoutAndRedirect = () => {
    localStorage.clear(); // 모든 토큰과 사용자 정보 삭제
    setAuthInfo({ isLoggedIn: false, role: "", username: "" }); // AuthContext 상태 초기화
    window.location.href = "/"; // 메인 페이지로 리다이렉트
  };
  

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const parsedToken = parseAccessToken(accessToken);
      if (parsedToken) {
        setAuthInfo({
          isLoggedIn: true,
          role: parsedToken.role,
          username: parsedToken.userName,
        });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authInfo, refreshAccessToken, setAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};