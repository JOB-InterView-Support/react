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

  // 공통 토큰 저장 및 상태 업데이트 함수
  const updateTokens = (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      const parsedToken = parseAccessToken(accessToken);
      if (parsedToken) {
        setAuthInfo({
          isLoggedIn: true,
          role: parsedToken.role,
          username: parsedToken.userName,
        });
      }
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  // 안전한 API 요청 처리 함수
  const secureApiRequest = async (url, options = {}, retry = true) => {
    console.log("AuthProvider.js secureApiRequest 실행");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      throw new Error("AccessToken 또는 RefreshToken이 없습니다.");
    }

    try {
      const response = await apiClient.get(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          AccessToken: `Bearer ${accessToken}`,
          ...options.headers,
        },
      });
      return response; // 성공 시 반환
    } catch (error) {
      console.error("API 요청 실패 - 상태 코드:", error.response?.status);
      console.error("API 응답 헤더:", error.response?.headers);
      console.error("API 응답 데이터:", error.response?.data);

      const tokenExpiredHeader = error.response?.headers["token-expired"];

      if (error.response?.status === 401 && retry) {
        // RefreshToken 만료 시 로그인 연장 여부 확인
        if (tokenExpiredHeader === "RefreshToken") {
          const confirmExtend = window.confirm(
            "로그인이 만료되었습니다. 연장하시겠습니까?"
          );
          if (confirmExtend) {
            try {
              await handleReissueTokens(true); // RefreshToken 재발급
              return secureApiRequest(url, options, false); // 재시도
            } catch (refreshError) {
              console.error("로그인 연장 실패:", refreshError.response?.data);
              alert("세션이 만료되었습니다. 다시 로그인해주세요.");
              logoutAndRedirect();
            }
          } else {
            alert("로그인이 연장되지 않았습니다. 다시 로그인해주세요.");
            logoutAndRedirect();
          }
        }

        // AccessToken 만료 시 RefreshToken으로 AccessToken 재발급
        if (tokenExpiredHeader === "AccessToken") {
          console.warn("AccessToken 만료. RefreshToken으로 재발급 시도 중...");
          try {
            await handleReissueTokens();
            return secureApiRequest(url, options, false); // 재시도
          } catch (refreshError) {
            console.error(
              "AccessToken 재발급 실패:",
              refreshError.response?.data
            );
            logoutAndRedirect();
          }
        }
      }

      throw error; // 다른 에러 처리
    }
  };

  // AccessToken 또는 RefreshToken 재발급 처리
  const handleReissueTokens = async (extendLogin = false) => {
    let accessToken = localStorage.getItem("accessToken")?.trim();
    let refreshToken = localStorage.getItem("refreshToken")?.trim();

    if (!accessToken || !refreshToken) {
      console.error("Reissue 요청 실패: 토큰이 존재하지 않습니다.");
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      logoutAndRedirect();
      return;
    }

    try {
      console.log("Reissue 요청 - AccessToken:", accessToken);
      console.log("Reissue 요청 - RefreshToken:", refreshToken);

      const response = await apiClient.post("/reissue", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          AccessToken: `Bearer ${accessToken}`,
          ExtendLogin: extendLogin ? "true" : "false",
        },
      });

      console.log("Reissue 성공 - 응답 헤더:", response.headers);
      updateTokens(
        response.headers["authorization"]?.split(" ")[1]?.trim(),
        response.headers["refresh-token"]?.split(" ")[1]?.trim()
      );
    } catch (error) {
      console.error("Reissue 실패 - 상태 코드:", error.response?.status);
      console.error("Reissue 실패 - 응답 데이터:", error.response?.data);

      const expiredTokenType = error.response?.headers["token-expired"];
      if (
        expiredTokenType === "RefreshToken" ||
        error.response?.data === "Session Expired"
      ) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        logoutAndRedirect();
      } else if (expiredTokenType === "AccessToken") {
        console.warn("AccessToken 만료됨. RefreshToken으로 재발급 시도 중...");
        return await handleReissueTokens();
      } else {
        console.error("Reissue 중 예상치 못한 오류 발생:", error.message);
        logoutAndRedirect();
      }
    }
  };

  // 로그아웃 함수
  const logoutAndRedirect = () => {
    if (!authInfo.isLoggedIn) return;
    localStorage.clear();
    setAuthInfo({ isLoggedIn: false, role: "", username: "" });
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ ...authInfo, setAuthInfo, secureApiRequest }}
    >
      {children}
    </AuthContext.Provider>
  );
};
