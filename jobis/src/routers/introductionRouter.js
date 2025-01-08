import React from "react";
import { Route } from "react-router-dom";

import Introduction from "../pages/Footer/Introduction";

const introductionRouters = [
    <Route path="/introduction" element={<Introduction />} />,
];

export default introductionRouters;