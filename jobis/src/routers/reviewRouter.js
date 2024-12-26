import React from "react";
import { Route } from "react-router-dom";
import ReviewList from "../pages/Review/ReviewList";
import ReviewDetail from "../pages/Review/ReviewDetail";
import ReviewInsert from "../pages/Review/ReviewInsert";
import ReviewUpdate from "../pages/Review/ReviewUpdate";

const reviewRouter = [
    <Route path="/Review" element={<ReviewList/>}/>,
    <Route path="/Review/detail/:no" element={<ReviewDetail/>}/>,
    <Route path="/Review/Insert/" element={<ReviewInsert/>}/>,
    <Route path="/Review/Update/:no" element={<ReviewUpdate/>}/>,
];

export default reviewRouter;