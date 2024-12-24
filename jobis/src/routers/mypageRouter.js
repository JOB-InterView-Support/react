import React from "react";
import { Route } from "react-router-dom";
import UpdateUser from "../pages/Mypage/UpdateUser";
import DeleteUser from "../pages/Mypage/DeleteUser";

const mypageRouter = [
    <Route path="/updateUser" element={<UpdateUser />} />,
    <Route path="/deleteUser" element={<DeleteUser />} />
];

export default mypageRouter;