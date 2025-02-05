import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./UpdateUser.module.css";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";

const UpdateUser = () => {


  const navigate = useNavigate();
  const { secureApiRequest } = useContext(AuthContext);
  const [user, setUser] = useState({
    userId: "",
    userName: "",
    userPw: "",
    userDefaultEmail: "",
    userPhone1: "",
    userPhone2: "",
    userPhone3: "",
    userKakaoEmail: "",
    userNaverEmail: "",
    userGoogleEmail: "",
    userFaceIdStatus: "", // 초기값 N
  });
  const [faceIdImage, setFaceIdImage] = useState(null); // Face ID 이미지
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("로그인 유저 정보 없음");
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await secureApiRequest(`/mypage/${storedUserId}`);
        const phone = response.data.userPhone || "";
        setUser({
          ...response.data,
          userPhone1: phone.slice(0, 3),
          userPhone2: phone.slice(3, 7),
          userPhone3: phone.slice(7),
          userKakaoEmail: response.data.userKakaoEmail || "",
          userNaverEmail: response.data.userNaverEmail || "",
          userGoogleEmail: response.data.userGoogleEmail || "",
          userFaceIdStatus: response.data.userFaceIdStatus || "N", // Face ID 상태 추가
        });
        // Face ID 상태가 Y이면 이미지 로드
        if (response.data.userFaceIdStatus === "Y") {
          fetchFaceIdImage();
        }
      } catch (error) {
        console.error(
          "로그인 유저 정보 없음:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [secureApiRequest]);

  // Face ID 이미지 로드 함수
  const fetchFaceIdImage = async () => {
    const uuid = localStorage.getItem("uuid");
    if (!uuid) {
      console.error("UUID 없음");
      alert("UUID를 확인할 수 없습니다.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/faceId/image/${uuid}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          setFaceIdImage(`data:image/jpeg;base64,${data.image}`);
        } else {
          console.error("이미지 데이터 없음");
          // alert("이미지를 가져오는 데 실패했습니다.");
        }
      } else {
        console.error("API 요청 실패:", response.statusText);
        // alert("서버에서 이미지를 로드하는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Face ID 이미지 로드 실패:", error);
      // alert("네트워크 오류로 이미지를 가져오지 못했습니다.");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = {
        userId: user.userId,
        userName: user.userName,
        userDefaultEmail: user.userDefaultEmail,
        userPhone: `${user.userPhone1}${user.userPhone2}${user.userPhone3}`,
      };

      // 비밀번호가 입력된 경우에만 추가
      if (user.userPw && user.userPw.trim() !== "") {
        updatedUser.userPw = user.userPw; // 사용자가 입력한 비밀번호
      } else {
        updatedUser.userPw = null; // 비밀번호 미입력 시 null로 전달
      }

      console.log("Sending JSON Data:", updatedUser);

      await secureApiRequest(`/mypage/${user.userId}`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("회원 정보가 성공적으로 수정되었습니다.");
      navigate("/");
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
      alert("회원 정보 수정 요청에 실패했습니다.");
    }
  };


  const linkedKakaoEmail = user.userKakaoEmail || "";
  const linkedNaverEmail = user.userNaverEmail || "";
  const linkedGoogleEmail = user.userGoogleEmail || "";

  // 환경 변수 불러오기
  const Rest_api_key = process.env.REACT_APP_KAKAO_API_KEY; // Kakao REST API Key
  const redirect_uri = process.env.REACT_APP_KAKAO_LINK_REDIRECT_URI; // Redirect URI

  // Kakao URL 생성
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&prompt=login`;

  const handleKakaoLink = () => {
    window.location.href = kakaoURL;
  };

  const handleUnlinkKakaoEmail = async () => {
    try {
      const uuid = localStorage.getItem("uuid"); // UUID 가져오기
      if (!uuid) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      const response = await secureApiRequest("/kakao/unlink", {
        method: "POST",
        body: JSON.stringify({ uuid }),
      });

      console.log("Axios 응답:", response);

      const responseData = response.data; // Axios 응답 데이터 접근
      console.log("Unlink Response:", responseData);

      if (response.status === 200) {
        // userKakaoEmail을 null로 변경
        setUser((prevUser) => ({
          ...prevUser,
          userKakaoEmail: "",
        }));
        alert(responseData.message || "카카오 이메일 연동이 해제되었습니다.");
        navigate("/updateUser");
      } else {
        alert(responseData.error || "카카오 이메일 해제에 실패했습니다.");
        navigate("/updateUser");
      }
    } catch (error) {
      console.error("Error unlinking Kakao email:", error);
      alert("카카오 이메일 해제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleNaverLink = () => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID; // 네이버 Client ID
    const redirectUri = process.env.REACT_APP_NAVER_LINK_REDIRECT_URI; // Redirect URI
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

  const handleUnlinkNaverEmail = async () => {
    try {
      const uuid = localStorage.getItem("uuid"); // UUID 가져오기
      if (!uuid) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      const response = await secureApiRequest("/naver/unlink", {
        method: "POST",
        body: JSON.stringify({ uuid }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Axios 응답:", response);

      const responseData = response.data; // Axios 응답 데이터 접근
      if (response.status === 200) {
        // userNaverEmail을 null로 변경
        setUser((prevUser) => ({
          ...prevUser,
          userNaverEmail: "",
        }));
        alert(responseData.message || "네이버 이메일 연동이 해제되었습니다.");
      } else {
        alert(responseData.error || "네이버 이메일 해제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error unlinking Naver email:", error);
      alert("네이버 이메일 해제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleGoogleLink = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_LINK_REDIRECT_URI;
    console.log("REACT_APP_GOOGLE_CLIENT_ID:", clientId);
    console.log("REACT_APP_GOOGLE_LINK_REDIRECT_URI:", redirectUri);

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

  const handleUnlinkGoogleEmail = async () => {
    try {
      const uuid = localStorage.getItem("uuid"); // UUID 가져오기
      if (!uuid) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      // `/google/unlink`로 POST 요청
      const response = await secureApiRequest("/google/unlink", {
        method: "POST",
        body: JSON.stringify({ uuid }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Axios 응답:", response);

      const responseData = response.data; // Axios 응답 데이터 접근
      if (response.status === 200) {
        // `userGoogleEmail`을 null로 변경
        setUser((prevUser) => ({
          ...prevUser,
          userGoogleEmail: "",
        }));
        alert(responseData.message || "구글 이메일 연동이 해제되었습니다.");
      } else {
        alert(responseData.error || "구글 이메일 해제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error unlinking Google email:", error);
      alert("구글 이메일 해제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteFaceId = async () => {
    try {
      const uuid = localStorage.getItem("uuid"); // UUID 가져오기
      if (!uuid) {
        alert("로그인 정보가 없습니다.");
        return;
      }
  
      // `/mypage/faceId/{uuid}`로 PUT 요청
      const response = await secureApiRequest(`/mypage/faceId/${uuid}`, {
        method: "PUT",
        body: JSON.stringify({ uuid }), // JSON 데이터로 uuid 전달
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("API 응답:", response);
  
      const responseData = response.data; // 응답 데이터 접근
      if (response.status === 200) {
        // `userFaceIdStatus`를 "N"으로 변경
        setUser((prevUser) => ({
          ...prevUser,
          userFaceIdStatus: "N",
        }));
        setFaceIdImage(null); // Face ID 이미지 초기화
        alert(responseData.message || "얼굴 로그인 상태가 초기화되었습니다.");
      } else {
        alert(responseData.error || "얼굴 로그인 상태 초기화에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting Face ID:", error);
      alert("서버 요청 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };
  



  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <MypageSubMenubar />
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        <h2 className={styles.subTitle}>회원 정보 수정</h2>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>이 름</label>
            <input
              type="text"
              className={styles.input}
              name="userName"
              value={user.userName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={styles.input}
              name="userId"
              value={user.userId}
              readOnly
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              className={styles.input}
              name="userPw"
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              className={styles.input}
              value={user.userDefaultEmail}
              name="userDefaultEmail"
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>휴대폰 번호</label>
            <div className={styles.phoneInputGroup}>
              <input
                type="text"
                className={`${styles.input} ${styles.phoneInput}`}
                name="userPhone1"
                value={user.userPhone1}
                maxLength={3}
                onChange={handleChange}
              />
              {' '}
              <input
                type="text"
                className={`${styles.input} ${styles.phoneInput}`}
                name="userPhone2"
                value={user.userPhone2}
                maxLength={4}
                onChange={handleChange}
              />
              {' '}
              <input
                type="text"
                className={`${styles.input} ${styles.phoneInput}`}
                name="userPhone3"
                value={user.userPhone3}
                maxLength={4}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>연동 카카오 이메일</label>
            <input
              type="email"
              className={styles.input}
              name="linkedKakaoEmail"
              value={linkedKakaoEmail || ""} // 빈 문자열 처리
              readOnly
            />
            {linkedKakaoEmail ? (
              <button
                type="button"
                className={styles.minibutton}
                onClick={handleUnlinkKakaoEmail}
              >
                해제
              </button>
            ) : (
              <button
                type="button"
                className={styles.minibutton}
                onClick={handleKakaoLink}
              >
                연동
              </button>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>연동 네이버 이메일</label>
            <input
              type="email"
              className={styles.input}
              name="linkedNaverEmail"
              value={linkedNaverEmail || ""}
              readOnly
            />
            {linkedNaverEmail ? (
              <button
                type="button"
                className={styles.minibutton}
                onClick={handleUnlinkNaverEmail}
              >
                해제
              </button>
            ) : (
              <button
                type="button"
                className={styles.minibutton}
                onClick={handleNaverLink}
              >
                연동
              </button>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>연동 구글 이메일</label>
            <input
              type="email"
              className={styles.input}
              name="linkedGoogleEmail"
              value={linkedGoogleEmail || ""}
              readOnly
            />
            {linkedGoogleEmail ? (
              <button
                type="button"
                className={styles.minibutton}
                onClick={handleUnlinkGoogleEmail}
              >
                해제
              </button>
            ) : (
              <button
                type="button"
                className={styles.minibutton}
                onClick={handleGoogleLink}
              >
                연동
              </button>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>얼굴 로그인</label>
            {user.userFaceIdStatus === "Y" ? (
              <div className={styles.faceIdImageContainer}>
                {faceIdImage ? (
                  <img
                    src={faceIdImage}
                    alt="Face ID 이미지"
                    className={styles.faceIdImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      setFaceIdImage(null);
                    }}
                  />
                ) : (
                  <div className={styles.errorMessage}>
                    이미지가 손상되었습니다. 해제 후 다시 등록해주세요.
                  </div>
                )}
                <button
                  className={styles.imgDeleteBtn}
                  onClick={handleDeleteFaceId}
                >
                  해제
                </button>
              </div>
            ) : (
              <Link to="/faceRegistration" className={styles.linkBtn}>
                <button className={styles.minibutton}>등록</button>
              </Link>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button onClick={handleUpdate} className={styles.button}>
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
