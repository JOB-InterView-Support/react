import axios from "axios";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 포함 여부
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (response) => {
    console.log("Axios 응답 성공:", response);
    return response;
  },
  (error) => {
    console.error("Axios 응답 에러:", error);
    return Promise.reject(error);
  },
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      config.headers["RefreshToken"] = `Bearer ${refreshToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
