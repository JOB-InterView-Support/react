// src/routers/router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage/MainPage';

import adminRouter from './adminRouter';
import aiInterviewRouter from './aiInterviewRouter';
import jobPostingRouter from './jobPostingRouter';
import loginRouter from './loginRouter';
import signupRouter from './signupRouter';
import mypageRouter from './mypageRouter'; // 이 경로 확인
import noticeRouter from './noticeRouter';
import payRouter from './payRouter';
import qnaRouter from './qnaRouter';
import reviewRouter from './reviewRouter';
import ticketRouter from './ticketRouter';
import interviewtestRouter from './interviewtestRouter';

const AppRouter = () => {
  return (
    <Routes>
      {adminRouter}
      {aiInterviewRouter}
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

      {/* 
      {reviewRouter}
       */}
       {/* 첨부 파일 요청 예외 처리 */}
      <Route path="/attachments/*" element={<></>} />
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
};

export default AppRouter;
