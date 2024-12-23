import React from "react";
import { Route } from "react-router-dom";
import TicketList from "../pages/Ticket/TicketList";
import TicketDetail from "../pages/Ticket/TicketDetail";

const TicketRouter = [
    <Route path="/ticketList" element={<TicketList/>}/>,
    <Route path="/ticketDetail" element={<TicketDetail/>}/>,
];

export default TicketRouter;
