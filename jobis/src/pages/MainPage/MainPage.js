import React from 'react';
import styles from './MainPage.module.css';
import main1 from '../../assets/images/main1.png';

function MainPage() {
  return (
    <div>
        <img src={main1} alt='Site Logo' className={styles.logo} />
    </div>
  );
}

export default MainPage;