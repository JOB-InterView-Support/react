import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage/MainPage";

import adminRouter from "./adminRouter";
import aiInterviewRouter from "./aiInterviewRouter";
import jobPostingRouter from "./jobPostingRouter";
import loginRouter from "./loginRouter";
import signupRouter from "./signupRouter";
import mypageRouter from "./mypageRouter";
import noticeRouter from "./noticeRouter";
import payRouter from "./payRouter";
import qnaRouter from "./qnaRouter";
import reviewRouter from "./reviewRouter";
import ticketRouter from "./ticketRouter";
import interviewtestRouter from "./interviewtestRouter";

const AppRouter = ({ setResultData }) => {
  return (
    <Routes>
      {adminRouter}
      {aiInterviewRouter.map((route) =>
        React.cloneElement(route, {
          element: React.cloneElement(route.props.element, { setResultData }),
        })
      )}
      {interviewtestRouter}
      {jobPostingRouter}
      {loginRouter}
      {signupRouter}
      {mypageRouter}
      {qnaRouter}
      {reviewRouter}
      {ticketRouter}
      {noticeRouter}
      {payRouter}
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
};

export default AppRouter;
