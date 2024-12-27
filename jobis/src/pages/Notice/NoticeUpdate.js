import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider"; // AuthContext 가져오기
import styles from "./NoticeInsert.module.css"; // CSS Modules

function NoticeUpdate() {
    const { isLoggedIn, secureApiRequest, role } = useContext(AuthContext);
    const [noticetitle, setNoticeTitle] = useState("");
    const [noticecontent, setNoticeContent] = useState("");
    const [noticefile, setNoticeFile] = useState(null);
    const [noticepreview, setNoticePreview] = useState(null);
    const navigate = useNavigate();
}

export default NoticeUpdate;