import React from "react";
import { Route } from "react-router-dom";
import InterviewTest from "../pages/AiInterview/InterviewTest";

const interviewTestRouter = [
    <Route path="/interviewTest" element={<InterviewTest />} />,
];

export default interviewTestRouter;