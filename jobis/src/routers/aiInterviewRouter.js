import React from "react";
import { Route } from "react-router-dom";
import SelectIntro from "../pages/AiInterview/SelectIntro";
import InterviewPage from "../pages/AiInterview/InterviewPage";
import InterviewTest from "../pages/AiInterview/InterviewTest";
import AiInterview from "../pages/AiInterview/AiInterview";
import AddSelfIntroduce from "../pages/AiInterview/AddSelfIntroduce";
import SelectSelfIntroduce from "../pages/AiInterview/SelectSelfIntroduce";
import InterviewResultPage from "../pages/AiInterview/InterviewResultPage";
import InterviewResultDetailPage from "../pages/AiInterview/InterviewResultDetailPage";

const aiInterviewRoutes = ({ setResultData, resultData }) => [
  <Route
    key="select-intro"
    path="/selectintro"
    element={
      <SelectIntro setResultData={setResultData} resultData={resultData} />
    }
  />,
  <Route
    key="interview-page"
    path="/interview/:intro_no/:round"
    element={<InterviewPage />}
  />,
  <Route
    key="interview-test"
    path="/interviewtest"
    element={<InterviewTest />}
  />,
  <Route
    key="ai-interview"
    path="/aiInterview/:intro_no/:round/:int_id"
    element={<AiInterview setResultData={setResultData} />}
  />,
  <Route
    key="add-self-introduce"
    path="/addSelfIntroduce/:introNo"
    element={<AddSelfIntroduce />}
  />,
  <Route
    key="select-self-introduce"
    path="/selectSelfIntroduce"
    element={<SelectSelfIntroduce />}
  />,
  <Route
    key="interview-result-page"
    path="/interviewResults/:uuid"
    element={<InterviewResultPage />}
  />,
  <Route
  key="interview-result-detail-page"
  path="/details/:int_id/:intro_id"
  element={<InterviewResultDetailPage />}
  />


];

export default aiInterviewRoutes;
