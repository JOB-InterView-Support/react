import React from 'react';
import { Route } from 'react-router-dom';
import NoticeList from '../pages/Notice/NoticeList';
import NoticeDetail from '../pages/Notice/NoticeDetail';


const noticeRouter = [
    <Route path="/notice" element={<NoticeList />} />,
    <Route path="/notice/detail/:no" element={<NoticeDetail />} />
];

export default noticeRouter;
