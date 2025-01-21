import React from "react";
import { Route } from "react-router-dom";
import UpdateUser from "../pages/Mypage/UpdateUser";
import DeleteUser from "../pages/Mypage/DeleteUser";
import MyTicketList from "../pages/Mypage/MyTicketList";
import MyIntroductionList from "../pages/Mypage/MyIntroductionList";
import MyIntroductionDetail from "../pages/Mypage/MyIntroductionDetail";
import MyIntroductionInsert from "../pages/Mypage/MyIntroductionInsert";
import MyIntroductionUpdate from "../pages/Mypage/MyIntroductionUpdate";
import KakaoLink from '../pages/Mypage/KakaoLink';
import NaverLink from '../pages/Mypage/NaverLink';
import GoogleLink from '../pages/Mypage/GoogleLink';
import FaceRegistration from '../pages/Mypage/FaceRegistration';

const mypageRouter = [
    <Route path="/updateUser" element={<UpdateUser />} />,
    <Route path="/deleteUser" element={<DeleteUser />} />,
    <Route path="/myTicketList" element={<MyTicketList />} />,
    <Route path="/myIntroductionList" element={<MyIntroductionList />} />,
    <Route path="/myIntroductionList/:id" element={<MyIntroductionDetail />} />,
    <Route path="/MyIntroductionInsert" element={<MyIntroductionInsert />} />,
    <Route path="/MyIntroductionUpdate/:id" element={<MyIntroductionUpdate />} />,
    <Route path="/kakaoLink" element={<KakaoLink />} />,
    <Route path="/naverLink" element={<NaverLink />} />,
    <Route path="/googleLink" element={<GoogleLink />} />,
    <Route path="/faceRegistration" element={<FaceRegistration />} />,
];

export default mypageRouter;