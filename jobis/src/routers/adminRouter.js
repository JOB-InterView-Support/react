import React from 'react';
import { Route } from 'react-router-dom';
import AdminMemberManagement from '../pages/Admin/AdminMemberManagement';
import AdminMemberManagementDetail from '../pages/Admin/AdminMemberManagementDetail';

import AdminSalesHistory from '../pages/Admin/AdminSalesHistory';
import AdminCommonQuestions from '../pages/Admin/AdminCommonQuestions';
import AdminInsertCommonQuestions from '../pages/Admin/AdminInsertCommonQuestions';
import AdminCommonQuestionsDetail from '../pages/Admin/AdminCommonQuestionsDetail';

const adminRouter = [
    <Route path="/adminMemberManagement" element={<AdminMemberManagement />} />,
    <Route path="/adminMemberDetail" element={<AdminMemberManagementDetail />} />,

    <Route path="/adminSalesHistory" element={<AdminSalesHistory />} />,
    <Route path="/adminCommonQuestions" element={<AdminCommonQuestions />} />,
    <Route path="/adminInsertCommonQuestions" element={<AdminInsertCommonQuestions />} />,
    <Route path="/adminCommonQuestionsDetail/:queId" element={<AdminCommonQuestionsDetail />} />,
];

export default adminRouter;
