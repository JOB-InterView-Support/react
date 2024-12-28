import React from "react";
import { Route } from "react-router-dom";
import JobPostingSearch from "../pages/JobPosting/JobPostingSearch";
import JobPostingList from "../pages/JobPosting/JobPostingList";
import JobPostingDetail from "../pages/JobPosting/JobPostingDetail";
import FavoritesList from "../pages/JobPosting/FavoritesList";

const jobPostingRouter = [
    <Route path="/jobPosting" element={<JobPostingSearch />} />,
    <Route path="/jobPostings/search" element={<JobPostingList />} />,
    <Route path="/jobpostingdetail/:id" element={<JobPostingDetail />} />,
    <Route path="/favoriteslist" element={<FavoritesList />} />
];

export default jobPostingRouter;
