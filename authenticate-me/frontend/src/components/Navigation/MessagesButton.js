import React from "react";
import { NavLink } from "react-router-dom";

const MessagesButton = () => {
  return (
    <NavLink className='navbar-button' to='/messages'>
      <i className="fa-regular fa-comment" id='messages-button'></i>
      Messages
    </NavLink>
  )
}

export default MessagesButton;
