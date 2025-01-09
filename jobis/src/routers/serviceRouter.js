import React from "react";
import { Route } from "react-router-dom";
import Service from "../pages/Policy/service";

const serviceRouter = [<Route path="/terms-of-service" element={<Service />} />];

export default serviceRouter;
