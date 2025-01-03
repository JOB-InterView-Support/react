import React from 'react';
import { Route } from 'react-router-dom';
import SelectIntro from '../pages/AiInterview/SelectIntro';

const aiInterviewRouter = [
    <Route path="/selectintro" element={<SelectIntro />} />,
];

export default aiInterviewRouter;