
import React from 'react';
import { Route } from 'react-router-dom';
import Signup from '../pages/Signup/Signup';
import SNSSignup from '../pages/Signup/SNSSignup';

const signupRouter = [
    <Route path="/signup" element={<Signup />} />,
    <Route path="/snsSignup" element={<SNSSignup />} />
];

export default signupRouter;