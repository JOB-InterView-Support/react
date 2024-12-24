import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./TicketSubMenubar.module.css";

function AdminSubMenubar() {
  const location = useLocation();

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
    </div>
  );
}

export default AdminSubMenubar;
