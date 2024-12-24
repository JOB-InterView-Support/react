import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeList.module.css"; // CSS Modules

function NoticeList() {

  return (
    <div className={styles.noticecontainer}>
      <h2 className={styles.noticetitle}>공지사항</h2>
      <table className={styles.noticetable}>
        <tbody>
          <td>{notice.noticeNo}</td>
          <td>{notice.noticeWDate}</td>
        </tbody>
      </table>
    </div>
  );
}

export default NoticeList;
