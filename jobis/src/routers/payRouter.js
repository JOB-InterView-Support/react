import React from "react";
import { Route } from "react-router-dom";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";

const PaymentRouter = [
    <Route path="/paymentSuccess" element={<PaymentSuccess/>}/>,
];

export default PaymentRouter;
