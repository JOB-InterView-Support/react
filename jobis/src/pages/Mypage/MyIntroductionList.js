import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import MypageSubMenubar from "../../components/common/subMenubar/MypageSubMenubar";

function MyIntroductionList() {
    return <div>
        <MypageSubMenubar />
        <h1>자기소개서 목록</h1>
    </div>
}

export default MyIntroductionList;