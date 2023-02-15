import React from "react";
import { NavLink } from "react-router-dom";

const NotificationButton = () => {

  return (
    <NavLink to='/notifications' className='navbar-button'>
      <i className="fa-regular fa-bell" id='notifications-button'></i>
      Notifications
    </NavLink>
  )
}

export default NotificationButton;
