import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from './AdminMemberManagement.module.css';
import AdminSubMenubar from "../../components/common/subMenubar/AdminSubMenubar";

function AdminSalesHistory() {
  return (
    <div>
      
      <AdminSubMenubar />

      
      <div className={styles.container}>
        <div>회원관리</div>
      </div>
    </div>
  );
}

export default AdminSalesHistory;
