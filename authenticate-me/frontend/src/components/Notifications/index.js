import React from "react";
import { useSelector } from "react-redux";

const NotificationPage = () => {
  const sessionUser = useSelector(state => state.session.user);

  if (!sessionUser)
    return (
      <div id='notifications-page-wrapper'>Login to view your notifications.</div>
    )
  else
    return (
      <div id='notifications-page-wrapper'>Notifications Page</div>
    );
};

export default NotificationPage;
