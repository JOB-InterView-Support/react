
import React from 'react';
import { Route } from 'react-router-dom';
import AdminMemberManagement from '../pages/Admin/AdminMemberManagement';
import AdminStatistics from '../pages/Admin/AdminStatistics';
import AdminSalesHistory from '../pages/Admin/AdminSalesHistory';

const adminRouter = [
    <Route path="/adminMemberManagement" element={<AdminMemberManagement />} />,
    <Route path="/adminStatistics" element={<AdminStatistics />} />,
    <Route path="/adminSalesHistory" element={<AdminSalesHistory />} />

];

export default adminRouter;