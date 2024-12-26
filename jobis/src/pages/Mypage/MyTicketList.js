import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";

function MyTicketList() {
    return <div>
        <MypageSubMenubar />
        <h1>이용권 내역</h1>
    </div>
}
export default MyTicketList;