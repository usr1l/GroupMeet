import React from "react";
import { useSelector } from "react-redux";

const NotificationPage = () => {
  const sessionUser = useSelector(state => state.session.user);

  if (!sessionUser)
    return (
      <div>Login to view your notifications.</div>
    )
  else

    return (
      <div>Notifications Page</div>
    );
};

export default NotificationPage;
