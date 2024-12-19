import React from "react";
import { Route } from "react-router-dom";

import jobPostingRouter from "../pages/JobPosting/JobPostingList"

const jobPostingRouter = [
    <Route path="/JobPostingList" element={<JobPostingList/>}/>,

];

export default jobPostingRouter;
