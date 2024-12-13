// src/routers/router.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage/MainPage';

import adminRouter from './adminRouter';
import aiInterviewRouter from './aiInterviewRouter';
import jobPostingRouter from './jobPostingRouter';
import loginRouter from './loginRouter';
import mypageRouter from './mypageRouter';
import noticeRouter from './noticeRouter';
import payRouter from './payRouter';
import qnaRouter from './qnaRouter';
import reviewRouter from './reviewRouter';
import ticketRouter from './ticketRouter';


const AppRouter = () => {
  return (
    <Routes>
      {/* {adminRouter}
      {aiInterviewRouter}
      {jobPostingRouter}
      {loginRouter}
      {mypageRouter}
      {noticeRouter}
      {payRouter}
      {qnaRouter}
      {reviewRouter}
      {ticketRouter} */}
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
};

export default AppRouter;


