import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import kakao from "../../assets/images/kakaotalk.png";
import naver from "../../assets/images/naver.png";
import google from "../../assets/images/google.png";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate(); // 여기에서 navigate를 선언
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

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

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8080/users/login", {
                userId,
                userPw: password,
            });

            const { accessToken, refreshToken } = response.data;

            // AccessToken에서 사용자 정보 추출
            const tokenPayload = base64DecodeUnicode(accessToken.split(".")[1]);
            if (!tokenPayload) throw new Error("토큰 페이로드 디코딩 실패");

            const { userId: decodedUserId, userName, adminYn } = tokenPayload;

            // 콘솔 출력
            console.log("AccessToken:", accessToken);
            console.log("RefreshToken:", refreshToken);
            console.log("UserId:", decodedUserId);
            console.log("UserName:", userName);
            console.log("AdminYn:", adminYn);

            // 로컬 스토리지에 저장
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userId", decodedUserId);
            localStorage.setItem("userName", userName);
            localStorage.setItem("adminYn", adminYn);

            alert("로그인 성공!");
            navigate('/'); // 메인페이지로 이동
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
