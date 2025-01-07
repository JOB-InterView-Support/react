import React from "react";
import { Route } from "react-router-dom";
import SelectIntro from "../pages/AiInterview/SelectIntro";
import InterviewPage from "../pages/AiInterview/InterviewPage";
import InterviewTest from '../pages/AiInterview/InterviewTest';
import AiInterview from '../pages/AiInterview/AiInterview';
import AddSelfIntroduce from '../pages/AiInterview/AddSelfIntroduce';
import SelectSelfIntroduce from '../pages/AiInterview/SelectSelfIntroduce';
import AiMockInterview from '../pages/AiInterview/AiMockInterview';

const aiInterviewRouter = [
  <Route path="/selectintro" element={<SelectIntro />} />,
  <Route path="/interview/:intro_no/:round" element={<InterviewPage />} />,
  <Route path="/interviewtest" element={<InterviewTest />} />,
  <Route path="/aiInterview/:intro_no/:round/:int_id" element={<AiInterview />} />,
  <Route path="/addSelfIntroduce/:introNo" element={<AddSelfIntroduce />} />,
  <Route path="/selectSelfIntroduce" element={<SelectSelfIntroduce />} />,
  <Route path="/aiMockInterview/:selectedIntro/:RoundId/:INT_ID" element={<AiMockInterview />} />

];

export default aiInterviewRouter;

