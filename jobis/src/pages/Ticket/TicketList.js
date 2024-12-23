import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from "../../utils/axios";
import styles from './TicketList.module.css';


function TicketList() {
    return(
        <div className={styles.ticketContainer}>
            <div className={styles.content}>
                <h3>6개월</h3>
                <h4>5 + 1회 이용권</h4>
                <p>자기소개서 분석 <br/>+<br/> AI 모의면접 <br/>+<br/> AI 면접 분석결과 확인</p>
                <h2>47000 원</h2>
                <button>구매하기</button>
            </div>
            <div className={styles.content}>
                <h3>1개월</h3>
                <h4>3회 이용권</h4>
                <p>자기소개서 분석 <br/>+<br/> AI 모의면접 <br/>+<br/> AI 면접 분석결과 확인</p>
                <h2>25000 원</h2>
                <button>구매하기</button>
            </div>
            <div className={styles.content}>
                <h3>24시간</h3>
                <h4>1회 이용권</h4>
                <p>자기소개서 분석 <br/>+<br/> AI 모의면접 <br/>+<br/> AI 면접 분석결과 확인</p>
                <h2>9900 원</h2>
                <button>구매하기</button>
            </div>
        </div>
            )
}

export default TicketList;