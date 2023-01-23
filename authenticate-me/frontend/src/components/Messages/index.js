import React from "react";
import { useSelector } from "react-redux";

const MessagesPage = () => {

  const sessionUser = useSelector(state => state.session.user);

  if (!sessionUser)
    return (
      <div>Login to view your messages.</div>
    )
  else
    return (
      <div>Messages Page</div>
    );
};

export default MessagesPage;
