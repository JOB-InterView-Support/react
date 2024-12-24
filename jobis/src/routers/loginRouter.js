
import React from 'react';
import { Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import KakaoLogin from '../pages/Login/KakaoLogin';

const loginRouter = [
    <Route path="/login" element={<Login />} />,
    <Route path="/kakaoLogin" element={<KakaoLogin />} />
];

export default loginRouter;