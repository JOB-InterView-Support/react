import React, { createContext, useState, useEffect } from "react";
import apiClient from "../src/utils/axios"; // apiClient 가져오기

export const AuthContext = createContext();

// JWT 파싱 함수
const parseAccessToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT 파싱 실패:", error.message);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // 인증 상태 관리
  const [authInfo, setAuthInfo] = useState({
    isLoggedIn: false,
    role: "",
    username: "",
  });

  const [isAuthInitialized, setIsAuthInitialized] = useState(false); // 초기화 여부 플래그

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

  // 초기화 함수
  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const role = localStorage.getItem("role");
      const username = localStorage.getItem("username");

      if (accessToken && refreshToken) {
        const parsedToken = parseAccessToken(accessToken);
        if (parsedToken) {
          setAuthInfo({
            isLoggedIn: true,
            role: role || parsedToken.role,
            username: username || parsedToken.userName,
          });
        }
      } else {
        console.warn("저장된 인증 정보가 없습니다.");
      }

      setIsAuthInitialized(true);
    };

    initializeAuth();
  }, []);

  // 안전한 API 요청 처리 함수
  const secureApiRequest = async (url, options = {}, retry = true) => {
    // 초기화가 완료될 때까지 대기
    if (!isAuthInitialized) {
      console.warn("인증 초기화가 완료되지 않았습니다. 대기 중...");
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (isAuthInitialized) {
            clearInterval(interval);
            resolve();
          }
        }, 100); // 100ms마다 초기화 상태 확인
      });
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      throw new Error("AccessToken 또는 RefreshToken이 없습니다.");
    }

    try {
      const method = options.method || "GET";
      const data = options.body || null;

      console.log(`API 요청 시작 - URL: ${url}, 메서드: ${method}`);
      console.log("요청 데이터:", data);

      const response = await apiClient({
        url,
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          refreshToken: `Bearer ${refreshToken}`,
          ...options.headers,
        },
        data,
      });

      console.log("API 요청 성공 - 응답 데이터:", response.data);
      return response;
    } catch (error) {
      console.error("API 요청 실패 ==============================");
      console.error("상태 코드:", error.response?.status || "알 수 없음");
      console.error("응답 데이터:", error.response?.data || "알 수 없음");

      const tokenExpiredHeader = error.response?.headers?.["token-expired"];
      if (error.response?.status === 401 && retry) {
        if (tokenExpiredHeader === "AccessToken") {
          console.warn("AccessToken 만료. RefreshToken으로 재발급 시도 중...");
          await handleReissueTokens();
          return secureApiRequest(url, options, false); // 재시도
        } else if (tokenExpiredHeader === "RefreshToken") {
          const confirmExtend = window.confirm(
            "로그인이 만료되었습니다. 연장하시겠습니까?"
          );
          if (confirmExtend) {
            try {
              await handleReissueTokens(true); // 연장 요청
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
      }

      throw error;
    }
  };

  // AccessToken 또는 RefreshToken 재발급 처리
  const handleReissueTokens = async (extendLogin = false) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      logoutAndRedirect();
      return;
    }

    try {
      const response = await apiClient.post("/reissue", null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          AccessToken: `Bearer ${accessToken}`,
          ExtendLogin: extendLogin ? "true" : "false",
        },
      });

      updateTokens(
        response.headers["authorization"]?.split(" ")[1],
        response.headers["refresh-token"]?.split(" ")[1]
      );
    } catch (error) {
      const expiredTokenType = error.response?.headers["token-expired"];
      if (expiredTokenType === "RefreshToken") {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        logoutAndRedirect();
      } else {
        console.error("Reissue 실패:", error.message);
        logoutAndRedirect();
      }
    }
  };

  // 로그아웃 처리 함수
  const logoutAndRedirect = () => {
    localStorage.clear();
    setAuthInfo({ isLoggedIn: false, role: "", username: "" });
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        ...authInfo,
        isAuthInitialized,
        setAuthInfo,
        secureApiRequest,
      }}
    >
      {isAuthInitialized ? children : <p>인증 상태 초기화 중...</p>}
    </AuthContext.Provider>
  );
};
