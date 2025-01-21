
import React from 'react';
import { Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import KakaoLogin from '../pages/Login/KakaoLogin';
import GoogleLogin from '../pages/Login/GoogleLogin';
import NaverLogin from '../pages/Login/NaverLogin'
import FaceLogin from '../pages/Login/FaceLogin';
import FindIdPw from '../pages/Login/FindIdPw';


const loginRouter = [
    <Route path="/login" element={<Login />} />,
    <Route path="/kakaoLogin" element={<KakaoLogin />} />,
    <Route path="/googleLogin" element={<GoogleLogin />} />,
    <Route path="/naverLogin" element={<NaverLogin />} />,
    <Route path="/faceLogin" element={<FaceLogin />} />,
    <Route path="/findIdPw" element={<FindIdPw />} />,
];

export default loginRouter;