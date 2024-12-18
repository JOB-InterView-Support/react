import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import apiClient from "../../utils/axios"; // apiClient 가져오기
import styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();
    const { setAuthInfo } = useContext(AuthContext); // AuthContext에서 상태 업데이트 함수 가져오기
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false); // 로그인 진행 상태

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) navigate("/"); // 이미 로그인 상태라면 메인 페이지로 이동
    }, [navigate]);

    // Base64 디코딩 함수
    const base64DecodeUnicode = (base64String) => {
        try {
            const base64 = base64String.replace(/-/g, "+").replace(/_/g, "/");
            const decoded = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((char) => `%${("00" + char.charCodeAt(0).toString(16)).slice(-2)}`)
                    .join("")
            );
            return JSON.parse(decoded);
        } catch (error) {
            console.error("JWT 페이로드 디코딩 실패:", error);
            return null; // 디코딩 실패 시 null 반환
        }
    };

    // 로그인 처리 함수
    const handleLogin = async () => {
        if (isLoggingIn) return; // 중복 요청 방지
        setIsLoggingIn(true);

        try {
            const response = await apiClient.post("/login", {
                userId: userId,
                userPw: password,
            });

            const { accessToken, refreshToken } = response.data;

            // JWT 디코딩 및 사용자 정보 추출
            const tokenPayload = base64DecodeUnicode(accessToken.split(".")[1]);
            if (!tokenPayload) throw new Error("JWT 페이로드 디코딩 실패");

            const {
                userId: decodedUserId = "unknown",
                userName = "unknown",
                role = "unknown",
            } = tokenPayload;

            // 콘솔 출력
            console.log("AccessToken:", accessToken);
            console.log("RefreshToken:", refreshToken);
            console.log("UserId:", decodedUserId);
            console.log("UserName:", userName);
            console.log("Role:", role);

            // 로컬 스토리지에 저장
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userId", decodedUserId);
            localStorage.setItem("userName", userName);
            localStorage.setItem("role", role);

            // AuthContext 상태 업데이트
            setAuthInfo({
                isLoggedIn: true,
                role: role,
                username: userName,
            });

            alert("로그인 성공!");
            navigate("/"); // 메인 페이지로 이동
        } catch (error) {
            // 에러 메시지 처리
            const errorMessage =
                error.response?.data?.error || "서버 오류로 인해 로그인에 실패했습니다. 다시 시도해주세요.";
            alert(errorMessage);
        } finally {
            setIsLoggingIn(false); // 요청 완료 후 로그인 상태 해제
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin(); // Enter 키가 눌리면 handleLogin 호출
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.top}>로그인</div>
            <div className={styles.inputText}>
                <div className={styles.idInput}>
                    아이디{" "}
                    <input
                        placeholder="아이디를 입력하세요"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <div className={styles.pwInput}>
                    비밀번호{" "}
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
                    />
                </div>
            </div>
            <div>
                <button
                    className={styles.loginBtn}
                    onClick={handleLogin}
                    disabled={isLoggingIn} // 로그인 진행 중 버튼 비활성화
                >
                    {isLoggingIn ? "로그인 중..." : "로그인"}
                </button>
            </div>
        </div>
    );
}

export default Login;
