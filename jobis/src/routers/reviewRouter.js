import React from "react";
import { Route } from "react-router-dom";
import ReviewList from "../pages/Review/ReviewList";
import ReviewDetail from "../pages/Review/ReviewDetail";
import ReviewInsert from "../pages/Review/ReviewInsert";
import ReviewUpdate from "../pages/Review/ReviewUpdate";

const reviewRouter = [
    <Route path="/review" element={<ReviewList/>}/>,
    <Route path="/review/detail/:no" element={<ReviewDetail/>}/>,
    <Route path="/review/Insert/" element={<ReviewInsert/>}/>,
    <Route path="/review/Update/:no" element={<ReviewUpdate/>}/>,
];

export default reviewRouter;