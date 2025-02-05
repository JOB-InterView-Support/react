import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import apiClient from "../../utils/axios";
import styles from "./Login.module.css";
import kakao from "../../assets/images/kakaotalk.png";
import naver from "../../assets/images/naver.png";
import google from "../../assets/images/google.png";

function Login() {
  const navigate = useNavigate();
  const { setAuthInfo } = useContext(AuthContext);
  console.log("setAuthInfo:", setAuthInfo);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) navigate("/");
  }, [navigate]);

  // Base64 디코딩 함수
  const base64DecodeUnicode = (base64String) => {
    try {
      const base64 = base64String.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            (char) => `%${("00" + char.charCodeAt(0).toString(16)).slice(-2)}`
          )
          .join("")
      );
      return JSON.parse(decoded);
    } catch (error) {
      console.error("JWT 디코딩 실패:", error);
      return null;
    }
  };

  // 로컬 스토리지에 토큰 및 사용자 정보 저장
  const saveToLocalStorage = (accessToken, refreshToken, userInfo) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userInfo.userId || "unknown");
    localStorage.setItem("userName", userInfo.userName || "unknown");
    localStorage.setItem("role", userInfo.role || "unknown");
    localStorage.setItem("uuid", userInfo.uuid || "unknown"); // UUID 저장
  };


  // 로그인 처리 함수
  const handleLogin = async () => {
    if (isLoggingIn) return; // 중복 요청 방지
    setIsLoggingIn(true);

    try {
      const response = await apiClient.post("/login", {
        userId,
        userPw: password,
      });

      console.log("서버 응답 데이터:", response);

      const {
        accessToken,
        refreshToken,
        uuid,
        userId: responseUserId,
        userName,
        role,
      } = response.data;

      // JWT 페이로드 디코딩
      const tokenPayload = base64DecodeUnicode(accessToken.split(".")[1]);
      if (!tokenPayload) {
        console.error("JWT 페이로드 디코딩 실패");
        throw new Error("JWT 페이로드 디코딩 실패"); // 불필요한 throw 방지
      }

      console.log("JWT 페이로드:", tokenPayload);

      const userInfo = {
        userId: responseUserId,
        userName,
        role,
        uuid, // UUID 추가
      };

      try {
        saveToLocalStorage(accessToken, refreshToken, userInfo);
        console.log("로컬 스토리지 저장 성공");
        setAuthInfo({
          isLoggedIn: true,
          role: userInfo.role,
          username: userInfo.userName,
          uuid: userInfo.uuid, // 상태 업데이트에 UUID 추가
        });
        console.log("AuthContext 상태 업데이트 성공");
      } catch (storageError) {
        console.error("로컬 스토리지 또는 상태 업데이트 오류:", storageError);
        throw storageError;
      }

      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 오류:", error);

      if (error.response) {
        console.error("에러 응답 데이터:", error.response.data);
        alert(
          error.response.data.error || "서버 오류로 인해 로그인에 실패했습니다."
        );
      } else if (error instanceof Error) {
        console.error("에러 메시지:", error.message);
        alert(error.message);
      } else {
        console.error("예상치 못한 오류:", error);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Enter 키 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  const Rest_api_key = process.env.REACT_APP_KAKAO_API_KEY; // REST API KEY
  const redirect_uri = process.env.REACT_APP_KAKAO_REDIRECT_URI; // Redirect URI

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&prompt=login`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  const handleGoogleLogin = () => {


    const clientId =  process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    console.log("REACT_APP_GOOGLE_CLIENT_ID:", clientId);
    console.log("REACT_APP_GOOGLE_REDIRECT_URI:", redirectUri);

    if (!clientId || !redirectUri) {
      console.error("환경 변수가 제대로 로드되지 않았습니다.");
      alert("구글 로그인 설정이 잘못되었습니다.");
      return;
    }

    const scope = "email profile";
    const state = "googleLogin";

    const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;

    window.location.href = googleURL;
  };

  const handleNaverLogin = () => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID; // 네이버 Client ID
    const redirectUri = process.env.REACT_APP_NAVER_REDIRECT_URI; // Redirect URI
    const state = process.env.REACT_APP_NAVER_STATE; // CSRF 방지를 위한 상태 토큰
  
    // 네이버 세션 초기화를 위한 로그아웃 URL 호출
    const logoutURL = "https://nid.naver.com/nidlogin.logout";
    fetch(logoutURL, { mode: "no-cors" }) // 로그아웃 요청 보내기
      .then(() => {
        // 로그아웃 완료 후 로그인 URL로 이동
        const naverURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&state=${state}`;
        window.location.href = naverURL;
      })
      .catch((error) => {
        console.error("네이버 로그아웃 중 오류 발생:", error);
        alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      });
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
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div>
        <button
          className={styles.loginBtn}
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </button>
      </div>
      <div className={styles.findIdPw}>
        <Link to="/findIdPw">아이디찾기 / 비밀번호찾기</Link>
      </div>
      <div className={styles.snsLogo}>
        <img
          src={kakao}
          alt="kakao Logo"
          className={styles.logo}
          onClick={handleKakaoLogin}
        />
        <img
          src={naver}
          alt="naver Logo"
          className={styles.logo}
          onClick={handleNaverLogin}
        />
        <img
          src={google}
          alt="google Logo"
          className={styles.logo}
          onClick={handleGoogleLogin}
        />
      </div>
      
      <div className={styles.snsName}>
        <div className={styles.kakaoName} onClick={handleKakaoLogin}>
          카카오
        </div>
        <div className={styles.naverName} onClick={handleNaverLogin}>
          네이버
        </div>
        <div className={styles.googleName} onClick={handleGoogleLogin}>
          구글
        </div>
      </div>
      <div className={styles.faceLogin}>
        <Link to="/faceLogin"><button className={styles.faceLoginBtn}>FaceId 로그인</button></Link>
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
