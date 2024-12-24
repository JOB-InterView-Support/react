import React from "react";
import { Route } from "react-router-dom";
import JobPostingSearch from "../pages/JobPosting/JobPostingSearch";
import JobPostingList from "../pages/JobPosting/JobPostingList";
import JobPostingDetail from "../pages/JobPosting/JobPostingDetail";
import FavoritesList from "../pages/JobPosting/FavoritesList";

const jobPostingRouter = [
    <Route path="/jobPosting" element={<JobPostingSearch/>} />, // 기본 경로 설정
    <Route path="//jobPostings/search" element={<JobPostingList/>} />,
    <Route path="/jobpostingdetail/:id" element={<JobPostingDetail/>} />, // 상세 페이지에 id 파라미터 추가
    <Route path="/favoriteslist" element={<FavoritesList/>} />
];

export default jobPostingRouter;
