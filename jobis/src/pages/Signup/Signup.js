import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './Signup.module.css'
import axios from 'axios';

function Signup() {
    const [userId, setUserId] = useState('');
    const [isIdAvailable, setIsIdAvailable] = useState(false); // 아이디 사용 가능 여부

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
        setIsIdAvailable(false); // 입력 변경 시 상태 초기화
    };

    const checkDuplicateId = async () => {
        console.log("checkDuplicateId 호출됨");
        if (!userId) {
            alert("아이디를 입력하세요.");
            return;
        }

        if (!/^[a-z0-9]{6,20}$/.test(userId)) {
            alert("아이디는 6~20자, 영문 소문자와 숫자만 사용할 수 있습니다.");
            return;
        }

        try {
            console.log("유저아이디: ", userId);
            const response = await axios.post('http://localhost:8080/users/checkuserId',
                { users: userId },
                { headers: { 'Content-Type': 'application/json' } }
            );

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
            <div className={style.signupTitle}>환영합니다! <br /> 당신의 취업을 도와주는 JOBIS 입니다! </div>
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
                                disabled={isIdAvailable} // 사용 가능할 경우 입력 비활성화
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
                                className={style.idCheckButton}
                                type="button"
                                onClick={checkDuplicateId}
                                disabled={isIdAvailable} // 사용 가능할 경우 버튼 비활성화
                            >
                                중복확인
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className={style.title}>비밀번호</td>
                        <td className={style.sub}><input type="password" placeholder="비밀번호" /><br /> 8~16자, 영문 대소문자, 숫자, 특수문자 중 2종류 이상 사용</td>
                    </tr>
                    <tr>
                        <td className={style.title}>비밀번호확인</td>
                        <td><input type="password" placeholder="비밀번호 재확인" /></td>
                    </tr>
                    <tr>
                        <td className={style.title}>이메일</td>
                        <td><input type="text" placeholder="이메일" /></td>
                        <td><button className={style.checkButton}>중복확인</button></td>
                        <td><button className={style.checkButton}>인증하기</button></td>
                    </tr>
                    <tr>
                        <td className={style.title}>인증번호</td>
                        <td><input type="text" placeholder="인증번호 입력" /></td>
                        <td><button className={style.checkButton}>인증하기</button></td>
                    </tr>
                    <tr>
                        <td className={style.title}>이름</td>
                        <td><input type="text" placeholder="실명 입력" /></td>
                    </tr>
                    <tr>
                        <td className={style.title}>생년월일</td>
                        <td className={style.sub}>
                            <input type="text" placeholder="생년월일 8자리" />
                            <br /> 예시 : 20010628
                        </td>
                        <td>
                            <div className={style.radioContainer}>
                                <input type="radio" id="male" name="gender" value="male" defaultChecked />
                                <label htmlFor="male"></label>
                                <span>남자</span>
                            </div>
                            <div className={style.radioContainer}>
                                <input type="radio" id="female" name="gender" value="female" />
                                <label htmlFor="female"></label>
                                <span>여자</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className={style.title}>전화번호</td>
                        <td className={style.sub}><input type="text" placeholder="전화번호 입력 '-' 없이" /><br /> 예시: 01012345678</td>
                        <td><button className={style.checkButton}>중복확인</button></td>
                    </tr>
                </tbody>
            </table>
            <hr className={style.bottomLine} />
            <div className={style.agreeCheck}>
                <div className={style.allCheck}><input type="checkbox" /> 모든 약관 사항에 전체 동의합니다</div>
                <hr className={style.checkLine} />
                <div>
                    <div><input type="checkbox" /> 서비스 이용약관 동의 (필수)</div>
                    <div><input type="checkbox" /> 개인정보 수집 및 이용 동의 필수 (필수)</div>
                    <div><input type="checkbox" /> 마케팅 정보 수신 동의 (선택)</div>
                </div>
            </div>
            <button className={style.signupBtn}>가입하기</button>
        </div>
    )
}


export default Signup;