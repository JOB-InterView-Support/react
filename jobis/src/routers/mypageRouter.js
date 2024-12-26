import React from "react";
import { Route } from "react-router-dom";
import UpdateUser from "../pages/Mypage/UpdateUser";
import DeleteUser from "../pages/Mypage/DeleteUser";
import MyTicketList from "../pages/Mypage/MyTicketList";
import MyIntroductionList from "../pages/Mypage/MyIntroductionList";
import MyIntroductionDetail from "../pages/Mypage/MyIntroductionDetail";

const mypageRouter = [
    <Route path="/updateUser" element={<UpdateUser />} />,
    <Route path="/deleteUser" element={<DeleteUser />} />,
    <Route path="/myTicketList" element={<MyTicketList />} />,
    <Route path="/myIntroductionList" element={<MyIntroductionList />} />,
    <Route path="/myIntroductionList/:id" element={<MyIntroductionDetail />} />,
];

export default mypageRouter;