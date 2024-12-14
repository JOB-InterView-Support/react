import React, { useState, useEffect, useRef } from 'react';
import style from './Signup.module.css';
import axios from 'axios';

function Signup() {
    const [userId, setUserId] = useState('');
    const [isIdAvailable, setIsIdAvailable] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true); // 비밀번호 유효성 상태
    const passwordInputRef = useRef(null);
    const [birthDate, setBirthDate] = useState('');
    const [birthDateError, setBirthDateError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isEmailAvailable, setIsEmailAvailable] = useState(false); // 이메일 사용 가능 여부
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [isVerified, setIsVerified] = useState(false); // 인증 성공 여부
    const [allChecked, setAllChecked] = useState(false); // 전체 동의 상태
    const [serviceAgreement, setServiceAgreement] = useState(false); // 서비스 이용약관 동의 상태
    const [privacyPolicy, setPrivacyPolicy] = useState(false); // 개인정보 수집 및 이용 동의 상태
    const [marketingConsent, setMarketingConsent] = useState(false); // 마케팅 정보 수신 동의 상태
    const [name, setName] = useState(''); // 이름 상태 추가
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
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*[\d@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

        // 비밀번호가 조건에 맞지 않을 경우에만 `alert` 실행
        if (!passwordRegex.test(password)) {
            if (isPasswordValid) { // 상태가 이미 유효하지 않은 경우에는 alert를 실행하지 않음
                alert('비밀번호는 8~16자, 영문 대소문자, 숫자, 특수문자 중 2종류 이상 사용해야 합니다.');
            }
            setPassword(''); // 비밀번호 초기화
            setIsPasswordValid(false); // 상태 업데이트
            passwordInputRef.current.focus(); // 입력란 포커스
        } else {
            setIsPasswordValid(true); // 조건 만족 시 상태 업데이트
        }
    };


    useEffect(() => {
        if (confirmPassword) {
            if (password !== confirmPassword) {
                setConfirmPasswordError('비밀번호가 다릅니다.');
            } else {
                setConfirmPasswordError('');
            }
        }
    }, [password, confirmPassword]);

    const handleBirthDateChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            setBirthDate(value);

            if (value.length !== 8) {
                setBirthDateError('*생년월일 8자리를 입력해주세요');
            } else {
                setBirthDateError('');
            }
        }
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            setPhoneNumber(value);
            setPhoneError('');
        } else {
            setPhoneError('*전화번호는 숫자만 입력 가능합니다');
        }
    };

    const handlePhoneCheck = async () => {
        if (phoneNumber.length === 0) {
            setPhoneError('*전화번호를 입력해주세요');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/users/checkPhoneNumber', {
                phoneNumber,
            });

            if (response.data === 'dup') {
                alert('이미 사용 중인 전화번호입니다.');
            } else {
                alert('사용 가능한 전화번호입니다.');
            }
        } catch (error) {
            console.error('전화번호 확인 중 오류 발생:', error);
            alert('전화번호 확인 중 오류가 발생했습니다.');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsEmailAvailable(false);
    };

    const checkDuplicateEmail = async () => {
        if (!email) {
            setEmailError('*이메일을 입력해주세요');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('*유효하지 않은 이메일 형식입니다');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/users/checkEmail', {
                email,
            });

            if (response.data === 'dup') {
                setEmailError('*이미 사용 중인 이메일입니다.');
                setIsEmailAvailable(false);
            } else {
                setEmailError('');
                setIsEmailAvailable(true);
            }
        } catch (error) {
            console.error('이메일 확인 중 오류 발생:', error);
            alert('이메일 확인 중 오류가 발생했습니다.');
        }
    };

    const handleSendVerificationEmail = async () => {
        if (!isEmailAvailable) {
            alert('이메일 중복 확인을 먼저 완료해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/users/sendVerificationEmail', {
                email,
            });

            alert(response.data);
        } catch (error) {
            console.error('인증 이메일 발송 중 오류 발생:', error);
            alert('인증 이메일 발송 중 오류가 발생했습니다.');
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            setVerificationError('*인증번호를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/users/verifyCode', {
                email,
                code: verificationCode,
            });

            alert(response.data);
            setIsVerified(true);
            setVerificationError('');
        } catch (error) {
            console.error('인증 코드 확인 중 오류 발생:', error);
            setVerificationError('*인증번호가 틀리거나 만료되었습니다.');
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
            const response = await axios.post('http://localhost:8080/users/checkuserId', {
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
            console.error("중복 확인 중 오류 발생:", error);
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
        if (!isEmailAvailable || !isVerified) {
            alert("이메일 중복 확인 및 인증을 완료해주세요.");
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
        const formattedBirthDate = `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}`;
        // gender 값을 "M" 또는 "F"로 변환
        const genderValue = gender === "male" ? "M" : "F";
        const signupData = {
            userId: userId,
            userPw: password,
            userDefaultEmail: email,
            userName: name,
            userBirthday: formattedBirthDate,
            userPhone: phoneNumber,
            userGender: genderValue,
        };


        // 전송 전에 데이터 로그 출력
        console.log("전송 데이터:", signupData);

        try {
            const response = await axios.post("http://localhost:8080/users/signup", signupData);

            if (response.data === "success") {
                alert("회원가입이 완료되었습니다.");
                // 필요한 경우 리다이렉트 처리
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
            <div className={style.signupTitle}>환영합니다! <br /> 당신의 취업을 도와주는 JOBIS 입니다!</div>
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
                                <span style={{ color: 'green', marginLeft: '10px' }}>
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
                                <span style={{ color: 'red' }}>{confirmPasswordError}</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className={style.title}>이메일</td>
                        <td>
                            <input
                                type="text"
                                placeholder="이메일"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isVerified} // 인증 성공 시 입력 필드 비활성화
                            />
                            <br />
                            {emailError && (
                                <span style={{ color: 'red', marginLeft: '10px' }}>{emailError}</span>
                            )}
                            {isEmailAvailable && !isVerified && (
                                <span style={{ color: 'green', marginLeft: '10px' }}>
                                    *사용 가능한 이메일입니다.
                                </span>
                            )}
                            {isVerified && (
                                <span style={{ color: 'green', marginLeft: '10px' }}>
                                    *이메일 인증이 완료되었습니다.
                                </span>
                            )}
                        </td>
                        <td>
                            <button
                                className={style.checkButton}
                                type="button"
                                onClick={checkDuplicateEmail}
                                disabled={isVerified || isEmailAvailable} // 인증 성공 시 버튼 비활성화
                                style={{
                                    backgroundColor: isVerified ? '#d3d3d3' : '',
                                    cursor: isVerified ? 'not-allowed' : 'pointer',
                                }}
                            >
                                중복확인
                            </button>
                        </td>
                        <td>
                            <button
                                className={style.checkButton}
                                type="button"
                                onClick={handleSendVerificationEmail}
                                disabled={!isEmailAvailable || isVerified} // 인증 성공 시 버튼 비활성화
                                style={{
                                    backgroundColor: isVerified ? '#d3d3d3' : '',
                                    cursor: isVerified ? 'not-allowed' : 'pointer',
                                }}
                            >
                                인증하기
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className={style.title}>인증번호</td>
                        <td>
                            <input
                                type="text"
                                placeholder="인증번호 입력"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                disabled={isVerified} // 인증 성공 시 입력 필드 비활성화
                            />
                            <br />
                            {isVerified ? (
                                <span style={{ color: 'green', marginLeft: '10px' }}>
                                    *이메일 인증이 완료되었습니다.
                                </span>
                            ) : (
                                verificationError && (
                                    <span style={{ color: 'red', marginLeft: '10px' }}>
                                        {verificationError}
                                    </span>
                                )
                            )}
                        </td>
                        <td>
                            <button
                                className={style.checkButton}
                                type="button"
                                onClick={handleVerifyCode}
                                disabled={isVerified} // 인증 성공 시 버튼 비활성화
                                style={{
                                    backgroundColor: isVerified ? '#d3d3d3' : '',
                                    cursor: isVerified ? 'not-allowed' : 'pointer',
                                }}
                            >
                                인증하기
                            </button>
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
                                <span style={{ color: 'red', marginLeft: '10px' }}>
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
                                <label htmlFor="female" className={style.customRadio}></label>여자
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
                            />
                            <br /> 예시: 01012345678
                            {phoneError && (
                                <span style={{ color: 'red', marginLeft: '10px' }}>
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
                            onChange={(e) => handleIndividualCheck("service", e.target.checked)} // 개별 체크박스 이벤트 핸들러
                        />{" "}
                        서비스 이용약관 동의 (필수)
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            checked={privacyPolicy} // 개인정보 수집 및 이용 상태
                            onChange={(e) => handleIndividualCheck("privacy", e.target.checked)} // 개별 체크박스 이벤트 핸들러
                        />{" "}
                        개인정보 수집 및 이용 동의 필수 (필수)
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            checked={marketingConsent} // 마케팅 정보 수신 상태
                            onChange={(e) => handleIndividualCheck("marketing", e.target.checked)} // 개별 체크박스 이벤트 핸들러
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

export default Signup;
