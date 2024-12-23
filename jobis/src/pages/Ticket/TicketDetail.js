import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from "../../utils/axios";
import styles from './TicketDetail.module.css';


function TicketDetail(){

    
    return(
    <div className={styles.paymentContainer}>
        <h1 className={styles.paymentTitle}>이용권 상세 내역</h1>

        <div className={styles.paymentBox}>
            <table className={styles.paymentTable}>
            <tbody>
                <tr>
                <th>선택한 이용권</th>
                <td>24시간 / 1회</td>
                </tr>
                <tr>
                <th>유효 기간</th>
                <td>사용일로부터 24시간</td>
                </tr>
                <tr>
                <th>상품 내용</th>
                <td>자기소개서 분석 + AI 모의면접 + AI 면접 채점&풀이 제공</td>
                </tr>
                <tr>
                <th>결제 방식</th>
                <td>카카오페이</td>
                </tr>
                <tr>
                <th>결제자</th>
                <td>홍길동</td>
                </tr>
                <tr>
                <th>결제 금액</th>
                <td>9900 원</td>
                </tr>
                <tr>
                <th>결제 번호</th>
                <td>280a8a4d-a27f-4041-b031-2a003cc4c039</td>
                </tr>
                <tr>
                <th>결제일자</th>
                <td>2024.11.03 (토) 13시 46분</td>
                </tr>
            </tbody>
            </table>
        </div>

        <div className={styles.buttonGroup}>
            <button className={styles.cancelButton}>환불 진행</button>
            <button className={styles.backButton}>돌아가기</button>
        </div>
    </div>

    )

    
}

export default TicketDetail;