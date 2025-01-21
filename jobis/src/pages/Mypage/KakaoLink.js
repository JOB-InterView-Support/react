import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "./KakaoLink.module.css";
import kakaoLogo from "../../assets/images/kakaotalk.png";
import { AuthContext } from "../../AuthProvider";

function KakaoLink() {
    const { secureApiRequest } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const extractCode = () => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            return urlParams.get("code");
        };

        const sendCodeToBackend = async (code) => {
            if (!isMounted) return;
        
            try {
                const uuid = localStorage.getItem("uuid"); // uuid 가져오기
                if (!uuid) {
                    alert("로그인 정보가 없습니다.");
                    navigate("/login");
                    return;
                }
        
                const response = await secureApiRequest("/kakao/link", {
                    method: "POST",
                    body: JSON.stringify({ code, uuid }),
                });
        
                // Axios 응답 데이터 접근 방식
                console.log("Axios 응답 성공:", response);
        
                const responseData = response.data; // data 속성에 JSON 응답 포함
                console.log("응답 상태 코드:", response.status);
                console.log("응답 본문:", responseData);
        
                if (response.status === 200 || responseData.success === "true") {
                    alert(responseData.message || "카카오 연동 성공했습니다.");
                    navigate("/updateUser");
                } else {
                    alert(responseData.error || "카카오 연동에 실패했습니다.");
                }
            } catch (error) {
                console.error("카카오 연동 처리 오류:", error);
                alert("카카오 연동에 실패했습니다. 다시 시도해주세요.");
                navigate("/updateUser");
            }
        };
        
        

        const code = extractCode();
        if (code) {
            sendCodeToBackend(code);
        }

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    return (
        <div className={style.container}>
            <img src={kakaoLogo} className={style.kakaoLogo} />
            <div>카카오 연동 처리 중...</div>
        </div>
    );
}

export default KakaoLink;
