import React, { useState, useEffect, useRef, useContext } from "react";
import style from "./Signup.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../utils/axios";
import kakaoLogo from "../../assets/images/kakaotalk.png";
import naverLogo from "../../assets/images/naver.png";
import googleLogo from "../../assets/images/google.png";

function SNSSignup() {
  const location = useLocation();
  const initialEmail = location.state?.email || ""; // 이메일 초기값 설정
  const snsType = location.state?.snsType || ""; // snsType 초기값 설정

  

  const [isPhoneAvailable, setIsPhoneAvailable] = useState(false); // 전화번호 사용 가능 여부 상태
  const [phoneMessage, setPhoneMessage] = useState(""); // 메시지 상태

  const navigate = useNavigate(); // 여기에서 navigate를 선언
  const [userId, setUserId] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true); // 비밀번호 유효성 상태
  const passwordInputRef = useRef(null);
  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState(""); 
  const [allChecked, setAllChecked] = useState(false); // 전체 동의 상태
  const [serviceAgreement, setServiceAgreement] = useState(false); // 서비스 이용약관 동의 상태
  const [privacyPolicy, setPrivacyPolicy] = useState(false); // 개인정보 수집 및 이용 동의 상태
  const [marketingConsent, setMarketingConsent] = useState(false); // 마케팅 정보 수신 동의 상태
  const [name, setName] = useState(""); // 이름 상태 추가
  const [gender, setGender] = useState("male"); // 성별 상태 (기본값: 남자)

  const handleAllCheck = (e) => {
    const checked = e.target.checked;

    // 전체 동의 상태 업데이트
    setAllChecked(checked);
    setServiceAgreement(checked);
    setPrivacyPolicy(checked);
    setMarketingConsent(checked);
  };

  const handleIndividualCheck = (type, checked) => {
    if (type === "service") {
      setServiceAgreement(checked);
    } else if (type === "privacy") {
      setPrivacyPolicy(checked);
    } else if (type === "marketing") {
      setMarketingConsent(checked);
    }

    // 전체 동의 상태 업데이트 (모든 개별 체크박스가 선택된 경우 true)
    setAllChecked(
      (type === "service" ? checked : serviceAgreement) &&
        (type === "privacy" ? checked : privacyPolicy) &&
        (type === "marketing" ? checked : marketingConsent)
    );
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    setIsIdAvailable(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsPasswordValid(true); // 입력 변경 시 유효성 상태 초기화
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*[\d@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    // 비밀번호가 조건에 맞지 않을 경우에만 `alert` 실행
    if (!passwordRegex.test(password)) {
      if (isPasswordValid) {
        // 상태가 이미 유효하지 않은 경우에는 alert를 실행하지 않음
        alert(
          "비밀번호는 8~16자, 영문 대소문자, 숫자, 특수문자 중 2종류 이상 사용해야 합니다."
        );
      }
      setPassword(""); // 비밀번호 초기화
      setIsPasswordValid(false); // 상태 업데이트
      passwordInputRef.current.focus(); // 입력란 포커스
    } else {
      setIsPasswordValid(true); // 조건 만족 시 상태 업데이트
    }
  };

  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordError("비밀번호가 다릅니다.");
      } else {
        setConfirmPasswordError("");
      }
    }
  }, [password, confirmPassword]);

  const handleBirthDateChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setBirthDate(value);

      if (value.length !== 8) {
        setBirthDateError("*생년월일 8자리를 입력해주세요");
      } else {
        setBirthDateError("");
      }
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
      setPhoneError("");
    } else {
      setPhoneError("*전화번호는 숫자만 입력 가능합니다");
    }
  };

  const handlePhoneCheck = async () => {
    if (phoneNumber.length === 0) {
      setPhoneError("*전화번호를 입력해주세요");
      return;
    }

    try {
      const response = await apiClient.post("/users/checkPhoneNumber", {
        phoneNumber,
      });

      if (response.data === "dup") {
        alert("이미 사용 중인 전화번호입니다.");
        setPhoneMessage(""); // 중복 시 메시지 초기화
        setIsPhoneAvailable(false);
      } else {
        alert("사용 가능한 전화번호입니다.");
        setPhoneMessage("*사용 가능한 전화번호입니다.");
        setIsPhoneAvailable(true);
      }
    } catch (error) {
      console.error("전화번호 확인 중 오류 발생:", error);
      alert("전화번호 확인 중 오류가 발생했습니다.");
    }
  };

  const checkDuplicateId = async () => {
    if (!userId) {
      alert("아이디를 입력하세요.");
      return;
    }

    if (!/^[a-z0-9]{6,20}$/.test(userId)) {
      alert("아이디는 6~20자, 영문 소문자와 숫자만 사용할 수 있습니다.");
      return;
    }

    try {
      const response = await apiClient.post("/users/checkuserId", {
        users: userId,
      });

      if (response.data === "dup") {
        alert("이미 사용 중인 아이디입니다.");
        setIsIdAvailable(false);
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsIdAvailable(true);
      }
    } catch (error) {
      console.error("중복 확인 중 오류 발생:", error.message);
      alert("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSignup = async () => {
    // 조건 검증
    if (!isIdAvailable) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }
    if (!isPasswordValid || confirmPasswordError) {
      alert("비밀번호를 확인해주세요.");
      return;
    }
   
    if (!birthDate || birthDateError) {
      alert("생년월일을 정확히 입력해주세요.");
      return;
    }
    if (!phoneNumber || phoneError) {
      alert("전화번호를 확인해주세요.");
      return;
    }
    if (!serviceAgreement || !privacyPolicy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    // 서버로 전송할 데이터
    // 생년월일 포맷 변경
    const formattedBirthDate = `${birthDate.slice(0, 4)}-${birthDate.slice(
      4,
      6
    )}-${birthDate.slice(6, 8)}`;
    // gender 값을 "M" 또는 "F"로 변환
    const genderValue = gender === "male" ? "M" : "F";
    const signupData = {
        user: {
            userId: userId,
            userPw: password,
            userDefaultEmail: initialEmail,
            userName: name,
            userBirthday: formattedBirthDate,
            userPhone: phoneNumber,
            userGender: genderValue,
        },
        snsType: snsType, // 별도로 추가
    };

    // 전송 전에 데이터 로그 출력
    console.log("전송 데이터:", signupData);

    try {
      const response = await apiClient.post(
        "/users/snsSignup",
        signupData
      );

      if (response.data === "success") {
        alert("회원가입이 완료되었습니다.");
        // 회원가입 성공 시 로그인 페이지로 리다이렉트
        navigate("/login"); // '/login'으로 이동
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={style.signupContainer}>
      <div className={style.signupTitle}>
        환영합니다! <br /> 당신의 취업을 도와주는 JOBIS 입니다!
      </div>

      <hr className={style.topLine} />
      <table className={style.signupTable}>
        <tbody>
          <tr>
            <td className={style.title}>아이디</td>
            <td className={style.sub}>
              <input
                type="text"
                placeholder="아이디"
                value={userId}
                onChange={handleUserIdChange}
                disabled={isIdAvailable}
              />
              <br /> 6~20자, 영문 소문자, 숫자만 사용
              {isIdAvailable && (
                <span style={{ color: "green", marginLeft: "10px" }}>
                  *사용 가능한 아이디입니다.
                </span>
              )}
            </td>
            <td>
              <button
                className={style.checkButton2}
                type="button"
                onClick={checkDuplicateId}
                disabled={isIdAvailable}
              >
                중복확인
              </button>
            </td>
          </tr>
          <tr>
            <td className={style.title}>비밀번호</td>
            <td className={style.sub}>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={handlePasswordChange}
                onBlur={validatePassword} // 조건 검증 함수 호출
                ref={passwordInputRef}
              />
              <br /> 8~16자, 영문 대소문자, 숫자, 특수문자 중 2종류 이상 사용
            </td>
          </tr>

          <tr>
            <td className={style.title}>비밀번호확인</td>
            <td>
              <input
                type="password"
                placeholder="비밀번호 재확인"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <br />
              {confirmPasswordError && (
                <span style={{ color: "red" }}>{confirmPasswordError}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className={style.title}>이메일</td>
            <td>
              <input
                type="text"
                placeholder="이메일"
                value={initialEmail}
                readOnly
              />
              <div className={style.emailType}>
                *
                {snsType && (
                  <span>
                    {snsType === "kakao"
                      ? "카카오"
                      : snsType === "naver"
                      ? "네이버"
                      : snsType === "google"
                      ? "구글"
                      : ""}{" "}
                  </span>
                )}
                이메일 인증이 완료되었습니다.
              </div>
            </td>
            <td>
              <div>
                {snsType === "kakao" && (
                  <div className={style.snsTypeText}>
                    <img src={kakaoLogo} className={style.Logo} />
                    카카오
                  </div>
                )}

                {snsType === "naver" && (
                  <div className={style.snsTypeText}>
                    <img src={naverLogo} className={style.Logo} />
                    네이버
                  </div>
                )}

                {snsType === "google" && (
                  <div className={style.snsTypeText}>
                    <img src={googleLogo} className={style.Logo} />
                    구글
                  </div>
                )}
              </div>
            </td>
          </tr>
          <tr>
            <td className={style.title}>이름</td>
            <td>
              <input
                type="text"
                placeholder="이름 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td className={style.title}>생년월일</td>
            <td className={style.sub}>
              <input
                type="text"
                placeholder="생년월일 8자리"
                value={birthDate}
                onChange={handleBirthDateChange}
                maxLength={8}
              />
              <br /> 예시 : 20010628
              {birthDateError && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  {birthDateError}
                </span>
              )}
            </td>
            <td className={style.radioContainer}>
              <div className={style.male}>
                <input
                  type="radio"
                  id="male"
                  name="gender" // 동일한 name 속성을 사용하여 그룹화
                  value="male" // value는 상태와 정확히 매칭
                  checked={gender === "male"} // 상태에 따라 선택 여부 결정
                  onChange={(e) => setGender(e.target.value)} // 상태 업데이트
                  className={style.hiddenRadio}
                />
                <label htmlFor="male" className={style.customRadio}></label>남자
              </div>
              <div className={style.female}>
                <input
                  type="radio"
                  id="female"
                  name="gender" // 동일한 name 속성을 사용하여 그룹화
                  value="female" // value는 상태와 정확히 매칭
                  checked={gender === "female"} // 상태에 따라 선택 여부 결정
                  onChange={(e) => setGender(e.target.value)} // 상태 업데이트
                  className={style.hiddenRadio}
                />
                <label htmlFor="female" className={style.customRadio}></label>
                여자
              </div>
            </td>
          </tr>
          <tr>
            <td className={style.title}>전화번호</td>
            <td className={style.sub}>
              <input
                type="text"
                placeholder="전화번호 입력 '-' 없이"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={11}
                disabled={isPhoneAvailable} // 전화번호가 사용 가능하면 비활성화
              />
              <br /> 예시: 01012345678
              <span style={{ color: isPhoneAvailable ? "green" : "red" }}>
                {phoneMessage}
              </span>
              {phoneError && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  {phoneError}
                </span>
              )}
            </td>
            <td>
              <button
                className={style.checkButton2}
                type="button"
                onClick={handlePhoneCheck}
              >
                중복확인
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <hr className={style.bottomLine} />
      <div className={style.agreeCheck}>
        <div className={style.allCheck}>
          <input
            type="checkbox"
            checked={allChecked} // 전체 동의 상태
            onChange={handleAllCheck} // 전체 동의 이벤트 핸들러
          />{" "}
          모든 약관 사항에 전체 동의합니다
        </div>
        <hr className={style.checkLine} />
        <div>
          <div>
            <input
              type="checkbox"
              checked={serviceAgreement} // 서비스 이용약관 상태
              onChange={(e) =>
                handleIndividualCheck("service", e.target.checked)
              } // 개별 체크박스 이벤트 핸들러
            />{" "}
            서비스 이용약관 동의 (필수)
          </div>
          <div>
            <input
              type="checkbox"
              checked={privacyPolicy} // 개인정보 수집 및 이용 상태
              onChange={(e) =>
                handleIndividualCheck("privacy", e.target.checked)
              } // 개별 체크박스 이벤트 핸들러
            />{" "}
            개인정보 수집 및 이용 동의 필수 (필수)
          </div>
          <div>
            <input
              type="checkbox"
              checked={marketingConsent} // 마케팅 정보 수신 상태
              onChange={(e) =>
                handleIndividualCheck("marketing", e.target.checked)
              } // 개별 체크박스 이벤트 핸들러
            />{" "}
            마케팅 정보 수신 동의 (선택)
          </div>
        </div>
      </div>

      <button
        className={style.signupBtn}
        onClick={handleSignup} // 이벤트 핸들러 연결
      >
        가입하기
      </button>
    </div>
  );
}

export default SNSSignup;
