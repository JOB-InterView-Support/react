import React from "react";
import { Route } from "react-router-dom";
import PaymentList from "../pages/Payment/PaymentList";
import PaymentDetail from "../pages/Payment/PaymentDetail";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentFail from "../pages/Payment/PaymentFail";
import CancelList from "../pages/Payment/CancelList";
import CancelDetail from "../pages/Payment/CancelDetail";

const PaymentRouter = [
    <Route path="/paymentList" element={<PaymentList/>}/>,
    <Route path="/paymentDetail" element={<PaymentDetail/>}/>,
    <Route path="/paymentSuccess" element={<PaymentSuccess/>}/>,
    <Route path="/paymentFail" element={<PaymentFail/>}/>,
    <Route path="/cancelList" element={<CancelList/>}/>,
    <Route path="/cancelDetail" element={<CancelDetail/>}/>,
];

export default PaymentRouter;
