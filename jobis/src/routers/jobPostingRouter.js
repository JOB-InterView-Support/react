import React from "react";
import { Route } from "react-router-dom";
import JobPostingSearch from "../pages/JobPosting/JobPostingSearch";
import JobPostingList from "../pages/JobPosting/JobPostingList";
import JobPostingDetail from "../pages/JobPosting/JobPostingDetail";
import FavoritesList from "../pages/JobPosting/FavoritesList";

const jobPostingRouter = [
    <Route path="/jobPosting" element={<JobPostingSearch />} />,
    <Route path="/jobPosting/search" element={<JobPostingList />} />,
    <Route path="/jobPosting/:id" element={<JobPostingDetail />} />,
    <Route path="/favorites/search" element={<FavoritesList />} />
];

export default jobPostingRouter;
