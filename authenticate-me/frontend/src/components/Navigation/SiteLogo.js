import React from 'react';
import logo from '../../images/logo.png';
import { NavLink } from 'react-router-dom';

const SiteLogo = () => {
  return (
    <NavLink exact to="/">
      <img id='site-logo' src={logo} alt='logo' />
    </NavLink>
  )
};

export default SiteLogo;
