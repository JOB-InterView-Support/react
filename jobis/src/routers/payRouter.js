import React from "react";
import { Route } from "react-router-dom";
import PaymentList from "../pages/Payment/PaymentList";
import PaymentDetail from "../pages/Payment/PaymentDetail";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";

const PaymentRouter = [
    <Route path="/paymentList" element={<PaymentList/>}/>,
    <Route path="/paymentDetail" element={<PaymentDetail/>}/>,
    <Route path="/paymentSuccess" element={<PaymentSuccess/>}/>,
];

export default PaymentRouter;
