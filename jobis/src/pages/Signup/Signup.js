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

        if (!passwordRegex.test(password)) {
            alert('비밀번호는 8~16자, 영문 대소문자, 숫자, 특수문자 중 2종류 이상 사용해야 합니다.');
            setPassword('');
            setIsPasswordValid(false);
            passwordInputRef.current.focus();
        } else {
            setIsPasswordValid(true);
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
                                onBlur={validatePassword}
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
                            />
                            <br />
                            {emailError && (
                                <span style={{ color: 'red', marginLeft: '10px' }}>{emailError}</span>
                            )}
                            {isEmailAvailable && (
                                <span style={{ color: 'green', marginLeft: '10px' }}>
                                    *사용 가능한 이메일입니다.
                                </span>
                            )}
                        </td>
                        <td>
                            <button
                                className={style.checkButton}
                                type="button"
                                onClick={checkDuplicateEmail}
                            >
                                중복확인
                            </button>
                        </td>
                        <td>
                            <button
                                className={style.checkButton}
                                type="button"
                                onClick={handleSendVerificationEmail}
                                disabled={!isEmailAvailable}
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
                            /><br />
                            {verificationError && (
                                <span style={{ color: 'red', marginLeft: '10px' }}>{verificationError}</span>
                            )}
                        </td>
                        <td>
                            <button
                                className={style.checkButton}
                                type="button"
                                onClick={handleVerifyCode}
                            >
                                인증하기
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className={style.title}>이름</td>
                        <td><input type="text" placeholder="실명 입력" /></td>
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
                    <input type="checkbox" /> 모든 약관 사항에 전체 동의합니다
                </div>
                <hr className={style.checkLine} />
                <div>
                    <div><input type="checkbox" /> 서비스 이용약관 동의 (필수)</div>
                    <div><input type="checkbox" /> 개인정보 수집 및 이용 동의 필수 (필수)</div>
                    <div><input type="checkbox" /> 마케팅 정보 수신 동의 (선택)</div>
                </div>
            </div>
            <button className={style.signupBtn}>가입하기</button>
        </div>
    );
}

export default Signup;
