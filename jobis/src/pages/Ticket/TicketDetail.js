import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from "../../utils/axios";
import styles from './TicketDetail.module.css';



function TicketDetail (){

    const tickets = [
       { name: "(6개월) 5+1회 이용권", price: "47000 원", date: "2024.11.01", cancelable: true },
       { name: "(24시간) 1회 이용권", price: "9900 원", date: "2024.10.28", cancelable: false },
       { name: "(24시간) 1회 이용권", price: "9900 원", date: "2024.10.28", cancelable: false },
     ];


    return(
    <div className={styles.container}>
        <h1 className={styles.header}>이용권 조회</h1>
        <table className={styles.table}>
            <thead>
            <tr>
                <th className={styles.tTName}>이용권 이름</th>
                <th className={styles.tTh}>금액</th>
                <th className={styles.tTh}>구매 날짜</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {tickets.map((ticket, index) => (
                <tr key={index}>
                <td className={styles.tName}>{ticket.name}</td>
                <td className={styles.tPrice}>{ticket.price}</td>
                <td className={styles.tDate}>{ticket.date}{ticket.cancelable && (
                        <span><button className={styles.cancelButton}>환불</button></span>
                    )}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    );
}

export default TicketDetail;