
import React from 'react';
import { Route } from 'react-router-dom';
import Signup from '../pages/Signup/Signup';

const signupRouter = [
    <Route path="/signup" element={<Signup />} />
];

export default signupRouter;