import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import style from "./GoogleLogin.module.css";
import googleLogo from "../../assets/images/google.png";
import apiClient from "../../utils/axios";

function GoogleLogin() {
    const navigate = useNavigate();
    const { setAuthInfo } = useContext(AuthContext);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const extractCode = () => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            return urlParams.get("code");
        };

        const sendCodeToBackend = async (code) => {
            if (isRequesting) return;
            setIsRequesting(true);

            try {
                const response = await apiClient.post("/google/apicode", { code });

                if (response.status === 409) {
                    // 등록되지 않은 이메일 처리
                    const data = response.data;
                    console.warn("등록되지 않은 이메일:", data.email);
                    alert("등록되지 않은 이메일입니다. 회원가입 페이지로 이동합니다.");
                    navigate("/snsSignup", {
                        state: {
                            email: data.email,
                            snsType: "google", // Google SNS 로그인 정보 전달
                        },
                    });
                    return;
                }

                // 정상 응답 처리
                const { accessToken, refreshToken, userId, userName, role, uuid } = response.data;

                // 로컬 스토리지에 데이터 저장
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("userId", userId || "unknown");
                localStorage.setItem("userName", userName || "unknown");
                localStorage.setItem("role", role || "unknown");
                localStorage.setItem("uuid", uuid || "unknown"); // UUID 저장

                // AuthContext 업데이트
                setAuthInfo({
                    isLoggedIn: true,
                    role: role,
                    username: userName,
                    uuid: uuid, // UUID 추가
                });

                alert("구글 로그인이 성공했습니다.");
                navigate("/"); // 메인 페이지로 이동
            } catch (error) {
                // 409 이외의 오류 처리
                if (error.response && error.response.status === 409) {
                    const data = error.response.data;
                    console.warn("등록되지 않은 이메일:", data.email);
                    alert("등록되지 않은 이메일입니다. 회원가입 페이지로 이동합니다.");
                    navigate("/snsSignup", {
                        state: {
                            email: data.email,
                            snsType: "google", // Google SNS 로그인 정보 전달
                        },
                    });
                } else {
                    console.error("구글 로그인 처리 오류:", error);
                    alert("구글 로그인에 실패했습니다. 다시 시도해주세요.");
                }
            } finally {
                if (isMounted) setIsRequesting(false);
            }
        };

        const code = extractCode();
        if (code && !isRequesting) {
            sendCodeToBackend(code);
        }

        return () => {
            isMounted = false;
        };
    }, [navigate, setAuthInfo, isRequesting]);

    return (
        <div className={style.container}>
            <img src={googleLogo} className={style.googleLogo} alt="Google Logo" />
            <div>구글 로그인 처리 중...</div>
        </div>
    );
}

export default GoogleLogin;
