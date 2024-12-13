import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import kakao from '../../assets/images/kakaotalk.png';
import naver from '../../assets/images/naver.png';
import google from '../../assets/images/google.png';



function Login() {
    return (
        <div className={styles.container}>
            <div className={styles.top}>로그인</div>
            <div className={styles.inputText}>
                <div className={styles.idInput}>아이디 <input placeholder='아이디를 입력하세요'></input></div>
                <div className={styles.pwInput}>비밀번호 <input placeholder='비밀번호를 입력하세요'></input></div>
            </div>
            <div>
                <button className={styles.loginBtn}>로그인</button>
            </div>
            <div className={styles.snsLogin}>
                SNS 로그인
            </div>
            <div className={styles.snsLogo}>
                <img src={kakao} alt='kakao Logo' className={styles.logo} />
                <img src={naver} alt='naver Logo' className={styles.logo} />
                <img src={google} alt='google Logo' className={styles.logo} />
            </div>
            <div className={styles.snsName}>
                <div className={styles.kakaoName}>카카오</div>
                <div className={styles.naverName}>네이버</div>
                <div className={styles.googleName}>구글</div>
            </div>
            <div className={styles.signupContainer}>
                <div>아직 회원이 아니신가요?</div>
                <div className={styles.signup}><Link  to="/signup">회원가입하기</Link></div>
            </div>
        </div>
    );
}

export default Login;