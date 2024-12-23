import React from "react";
import { Route } from "react-router-dom";
import PaymentList from "../pages/Payment/PaymentList";
import PaymentDetail from "../pages/Payment/PaymentDetail";
import CancelList from "../pages/Payment/CancelList";
import CancelDetail from "../pages/Payment/CancelDetail";

const PaymentRouter = [
    <Route path="/paymentList" element={<PaymentList/>}/>,
    <Route path="/paymentDetail" element={<PaymentDetail/>}/>,
    <Route path="/cancelList" element={<CancelList/>}/>,
    <Route path="/cancelDetail" element={<CancelDetail/>}/>,
];

export default PaymentRouter;
