import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import kakao from "../../assets/images/kakaotalk.png";
import naver from "../../assets/images/naver.png";
import google from "../../assets/images/google.png";

function Login() {
    const navigate = useNavigate(); // 페이지 이동
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
    
        if (accessToken) {
            navigate("/"); // 로그인된 사용자는 메인 페이지로 이동
        } else if (window.location.pathname !== "/login") {
            navigate("/login"); // 비로그인 사용자는 로그인 페이지로 이동
        }
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
            console.error("Base64 디코딩 실패:", error);
            return null;
        }
    };

    // 로그인 처리 함수
    const handleLogin = async () => {
        try {
            console.log("아이디:", userId);
            console.log("비밀번호:", password);
    
            // 서버에 로그인 요청
            const response = await axios.post("http://localhost:8080/login", {
                userId: userId,
                userPw: password,
            });
    
            const { accessToken, refreshToken } = response.data;
    
            // JWT 디코딩 및 사용자 정보 추출
            const tokenPayload = base64DecodeUnicode(accessToken.split(".")[1]);
            if (!tokenPayload) throw new Error("토큰 페이로드 디코딩 실패");
    
            console.log("디코딩된 JWT Payload:", tokenPayload);
    
            // 클레임에서 사용자 정보 추출
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
    
            alert("로그인 성공!");
            navigate("/"); // 메인 페이지로 이동
        } catch (error) {
            console.error("로그인 실패:", error.response?.data || error.message);
            alert("로그인 실패: 다시 시도하십시오.");
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
                    />
                </div>
            </div>
            <div>
                <button className={styles.loginBtn} onClick={handleLogin}>
                    로그인
                </button>
            </div>
            <div className={styles.snsLogo}>
                <img src={kakao} alt="kakao Logo" className={styles.logo} />
                <img src={naver} alt="naver Logo" className={styles.logo} />
                <img src={google} alt="google Logo" className={styles.logo} />
            </div>
            <div className={styles.snsName}>
                <div className={styles.kakaoName}>카카오</div>
                <div className={styles.naverName}>네이버</div>
                <div className={styles.googleName}>구글</div>
            </div>
            <div className={styles.signupContainer}>
                <div>아직 회원이 아니신가요?</div>
                <div className={styles.signup}>
                    <Link to="/signup">회원가입하기</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
