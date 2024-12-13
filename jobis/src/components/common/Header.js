import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'; // 로고 이미지
import styles from './Header.module.css'; // CSS Modules



function Header() {

    return (
        <header className={styles.header}>
            <div>
                <img src={logo} alt='Site Logo' className={styles.logo} />
            </div>
            <nav>
                <ul className={styles.navList}>
                    <li>공지사항</li>
                    <li>AI 모의면접</li>
                    <li>채용공고</li>
                    <li>체험 후기</li>
                    <li>Q&A</li>
                    <li>이용권</li>
                </ul>
            </nav>
            <div className={styles.rightBtn}>
                <div className={styles.top}>관리자님 환영합니다.</div>
                <div className={styles.bottom}>
                    <button>마이페이지</button>
                    <button>로그인</button>
                </div>
            </div>
        </header>
    )
}

export default Header;
