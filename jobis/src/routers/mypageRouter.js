import React from "react";
import { Route } from "react-router-dom";
import UpdateUser from "../pages/Mypage/UpdateUser";

const mypageRouter = [
    <Route path="/updateUser" element={<UpdateUser />} />
];

export default mypageRouter;