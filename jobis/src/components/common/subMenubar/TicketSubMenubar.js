import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./TicketSubMenubar.module.css";
import { useContext } from "react";
import { AuthContext } from "../../../AuthProvider";



function TicketSubMenubar() {
  const location = useLocation();
  const { role } = useContext(AuthContext); // AuthContext에서 role 가져오기

  return (
    <div className={styles.container}>
      <Link to="/ticketList" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/ticketList" ? styles.active : ""}`}>
          이용권 구매
        </div>
      </Link>

      <Link to="/ticketDetail" className={styles.menuItem}>
        <div className={`${styles.menuItem} ${location.pathname === "/ticketDetail" ? styles.active : ""}`}>
          조회/환불
        </div>
      </Link>

      {role === "ADMIN" && ( // ADMIN 역할인 경우에만 "상품 관리" 메뉴 표시
        <Link to="/ticketInfo" className={styles.menuItem}>
          <div
            className={`${styles.menuItem} ${
              location.pathname === "/ticketInfo" ? styles.active : ""
            }`}
          >
            상품 관리
          </div>
        </Link>
      )}
    </div>
  );
}

export default TicketSubMenubar;
