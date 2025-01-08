import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage/MainPage';

import adminRouter from './adminRouter';
import aiInterviewRouter from './aiInterviewRouter';
import jobPostingRouter from './jobPostingRouter';
import loginRouter from './loginRouter';
import signupRouter from './signupRouter';
import mypageRouter from './mypageRouter';
import noticeRouter from './noticeRouter';
import payRouter from './payRouter';
import qnaRouter from './qnaRouter';
import reviewRouter from './reviewRouter';
import ticketRouter from './ticketRouter';
import interviewtestRouter from './interviewtestRouter';
import Introduction from '../pages/Footer/Introduction';

const router = ({ setResultData, resultData }) => {
  return (
    <Routes>
      {adminRouter}
      {aiInterviewRouter({ setResultData, resultData })}
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
      {/* Introduction Route 추가 */}
      <Route path="/introduction" element={<Introduction />} />
      <Route path="/attachments/*" element={<></>} />
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
};

export default router;
