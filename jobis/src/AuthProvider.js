// src/AuthProvider.js
// 전역 상태 관리자 : 로그인 여부 상태와 accessToken, refreshToken 상태 관리가 목적임

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Context 생성
export const AuthContext = createContext();

// accessToken 파싱 함수 : 페이로드만 추출해서 JSON 객체로 리턴함
const parseAccessToken = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );
  return JSON.parse(jsonPayload);
};

// Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState({ isLoggedIn: false, role: '', username: '' });

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      // reissue 요청시 refreshToken 을 parameter 로 전송한다면
      // const response = await axios.post('http://localhost:8080/reissue', { refreshToken });

      // 만들어 놓은 reissue 컨트롤러에서는 request header 에 'Bearer' 뒤에 추가한것을 추출하게 해 놓았음
      const response = await axios.post('http://localhost:8080/reissue', null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const newAccessToken = response.headers['authorization'].split(' ')[1];
      const newRefreshToken = response.headers['refresh-token'].split(' ')[1];

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      const parsedToken = parseAccessToken(newAccessToken);

      setAuthInfo({
        isLoggedIn: true,
        role: parsedToken.role,
        username: parsedToken.username,
      });
    } catch (error) {
      console.error('Failed to refresh token : ', error);
      setAuthInfo({ isLoggedIn: false, role: '', username: '' });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const parsedToken = parseAccessToken(token);
      if (parsedToken) {
        setAuthInfo({
          isLoggedIn: true,
          role: parsedToken.role,
          username: parsedToken.username,
        });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authInfo, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
