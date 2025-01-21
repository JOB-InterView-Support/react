import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import instagram from '../../assets/images/instagram.png';
import youtube from '../../assets/images/youtube.png';
import facebook from '../../assets/images/facebook.png';
import styles from './Footer.module.css'; // CSS Modules


function Footer() {

  return (
    <footer className={styles.footer}>
      <div className={styles.leftLogo}>
        <img src={instagram} alt='instagram Logo' className={styles.logo} />
        <img src={youtube} alt='youtube Logo' className={styles.logo} />
        <img src={facebook} alt='facebook Logo' className={styles.logo} />
      </div>
      <div className={styles.center}>
        <div className={styles.centerTop}>
          <Link to="/introduction" className={styles.noLink}>회사소개</Link>
          <Link to="/qna" className={styles.noLink}>Q&A</Link>
          <div>이용권 안내</div>
        </div>
        <div className={styles.centerBottom}>
          <Link to="/service" className={styles.noLink}>이용약관</Link>
          <Link to="/privacy" className={styles.noLink}>개인정보처리방침</Link>
        </div>
        <div className={styles.bottom}>@2024 SS - SevenSegment</div>
      </div>
      <div className={styles.right}>
        <div>Address : 서울 서초구 강남구 서초대로 77길 41 4층</div>
        <div>Tel : 0507-1395-6865</div>
        <div>Email : jobisdev@gmail.com</div>
      </div>
    </footer>
  )
}

export default Footer;
