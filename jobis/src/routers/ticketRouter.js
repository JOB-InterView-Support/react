import React from "react";
import { Route } from "react-router-dom";
import TicketList from "../pages/Ticket/TicketList";
import TicketInfo from "../pages/Ticket/TicketInfo";
import TicketDetail from "../pages/Ticket/TicketDetail";

const TicketRouter = [
    <Route path="/ticketList" element={<TicketList/>}/>,
    <Route path="/ticketInfo" element={<TicketInfo/>}/>,
    <Route path="/ticketDetail" element={<TicketDetail/>}/>,
];

export default TicketRouter;
