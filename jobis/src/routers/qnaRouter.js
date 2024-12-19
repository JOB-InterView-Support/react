import React from "react";
import { Route } from "react-router-dom";

import QnaList from "../pages/Qna/QnaList";
import QnaDetail from '../pages/Qna/QnaDetail';
import QnaInsert from '../pages/Qna/QnaInsert';
import QnaUpdate from '../pages/Qna/QnaUpdate';

const qnaRouter = [
    <Route path="/Qna" element={<QnaList/>}/>,
    <Route path="/Qna/detail/:no" element={<QnaDetail/>}/>,
    <Route path="/Qna/Insert/" element={<QnaInsert/>}/>,
    <Route path="/Qna/Update/:no" element={<QnaUpdate/>}/>,
];

export default qnaRouter;