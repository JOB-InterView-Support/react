import React, { createContext, useState, useEffect } from "react";
import apiClient from "../src/utils/axios"; // apiClient 가져오기

// AuthContext 생성
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 인증 정보 상태
  const [authInfo, setAuthInfo] = useState({
    isLoggedIn: false,
    role: "",
    username: "",
  });

  // 초기화 상태 플래그
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // 토큰 상태 관리
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || "");

  // 로컬 스토리지에서 인증 정보 복구
  useEffect(() => {
    console.log("AuthProvider 초기화 중...");
    console.log("액세스 토큰",accessToken)
    console.log("리프레시 토큰",refreshToken)
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    if (accessToken && role) {
      console.log("로컬 스토리지에서 인증 정보 복구 완료.");
      setAuthInfo({
        isLoggedIn: true,
        role,
        username: username || "",
      });
    } else {
      console.warn("로컬 스토리지에 인증 정보가 없습니다.");
    }

    setIsAuthInitialized(true); // 초기화 완료
  }, [accessToken, refreshToken]); // 토큰 변경시마다 실행

  // JWT 디코딩 함수
  const parseAccessToken = (token) => {
    if (!token) {
      console.warn("JWT 디코딩 실패: 토큰이 비어있습니다.");
      return null;
    }
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
      console.error("JWT 디코딩 중 오류 발생:", error);
      return null;
    }
  };

  // 토큰 업데이트 함수
  const updateTokens = (newAccessToken, newRefreshToken) => {
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
      const parsedToken = parseAccessToken(newAccessToken);
      if (parsedToken) {
        console.log("AccessToken 디코딩 성공:", parsedToken);
        setAuthInfo({
          isLoggedIn: true,
          role: parsedToken.role,
          username: parsedToken.userName,
        });
      }
    }
    if (newRefreshToken) {
      console.log("RefreshToken 업데이트.");
      localStorage.setItem("refreshToken", newRefreshToken);
    }
  };

  // 안전한 API 요청 처리 함수
  const secureApiRequest = async (url, options = {}, retry = true) => {
    if (!isAuthInitialized) {
      throw new Error("인증 상태가 초기화되지 않았습니다.");
    }

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
          console.error("RefreshToken 만료. 로그아웃 처리.");
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          logoutAndRedirect();
        }
      }

      throw error;
    }
  };

  // AccessToken 또는 RefreshToken 재발급 처리
  const handleReissueTokens = async (extendLogin = false) => {
    const accessToken = localStorage.getItem("accessToken")?.trim();
    const refreshToken = localStorage.getItem("refreshToken")?.trim();

    if (!accessToken || !refreshToken) {
      console.error("Reissue 요청 실패: AccessToken 또는 RefreshToken이 없습니다.");
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      logoutAndRedirect();
      return;
    }

    try {
      console.log("Reissue 요청 시작 ==============================");
      console.log("현재 AccessToken:", accessToken);
      console.log("현재 RefreshToken:", refreshToken);

      const response = await apiClient.post("/reissue", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          refreshToken: `Bearer ${refreshToken}`,
          ExtendLogin: extendLogin ? "true" : "false",
        },
      });

      const newAccessToken = response.headers["authorization"]?.split(" ")[1]?.trim();
      const newRefreshToken = response.headers["refresh-token"]?.split(" ")[1]?.trim();

      console.log("Reissue 성공 ===============================");
      console.log("새로운 AccessToken:", newAccessToken);
      console.log("새로운 RefreshToken:", newRefreshToken);

      updateTokens(newAccessToken, newRefreshToken);
    } catch (error) {
      console.error("Reissue 요청 중 오류 발생 ==================");
      console.error("상태 코드:", error.response?.status || "알 수 없음");
      console.error("응답 데이터:", error.response?.data || "알 수 없음");

      const expiredTokenType = error.response?.headers?.["token-expired"];
      if (expiredTokenType === "RefreshToken") {
        console.error("RefreshToken 만료. 로그아웃 처리.");
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        logoutAndRedirect();
      } else if (expiredTokenType === "AccessToken") {
        console.warn("AccessToken 만료. RefreshToken으로 재발급 시도 중...");
        return await handleReissueTokens();
      } else {
        console.error("예상치 못한 오류 발생. 로그아웃 처리.");
        logoutAndRedirect();
      }
    }
  };

  // 로그아웃 처리 및 리다이렉트
  const logoutAndRedirect = () => {
    console.warn("로그아웃 처리 및 세션 초기화.");
    localStorage.clear();
    setAuthInfo({ isLoggedIn: false, role: "", username: "" });
    window.location.href = "/login";
  };

  // Context로 제공할 값
  return (
    <AuthContext.Provider
      value={{
        ...authInfo,
        isAuthInitialized,
        setAuthInfo,
        secureApiRequest,
        updateTokens,  // 추가된 부분: 외부에서 토큰 업데이트 가능하게 함
      }}
    >
      {isAuthInitialized ? children : <p>초기화 중입니다...</p>}
    </AuthContext.Provider>
  );
};
