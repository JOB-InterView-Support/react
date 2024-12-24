import React from 'react';
import { Route } from 'react-router-dom';
import AdminMemberManagement from '../pages/Admin/AdminMemberManagement';
import NoticeList from '../pages/Notice/NoticeList';

const noticeRouter = [
    <Route path="/noticeList" element={<NoticeList />} />
];

export default noticeRouter;
