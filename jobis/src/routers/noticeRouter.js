import React from 'react';
import { Route } from 'react-router-dom';
import NoticeList from '../pages/Notice/NoticeList';
import NoticeDetail from '../pages/Notice/NoticeDetail';
import NoticeInsert from '../pages/Notice/NoticeInsert';
import NoticeUpdate from '../pages/Notice/NoticeUpdate';


const noticeRouter = [
    <Route path="/notice" element={<NoticeList />} />,
    <Route path="/notice/detail/:no" element={<NoticeDetail />} />,
    <Route path="/notice/insert" element={<NoticeInsert />} />,
    <Route path="/notice/update/:no" element={<NoticeUpdate />} />
];

export default noticeRouter;
