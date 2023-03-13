import React from "react";
import { useSelector } from "react-redux";
import './Messages.css';

const MessagesPage = () => {

  const sessionUser = useSelector(state => state.session.user);

  if (!sessionUser)
    return (
      <div id="messages-page-wrapper">Login to view your messages.</div>
    )
  else
    return (
      <div id="messages-page-wrapper">Messages Page</div>
    );
};

export default MessagesPage;
