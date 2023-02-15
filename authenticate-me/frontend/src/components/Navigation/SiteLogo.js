import React from 'react';
import logo from '../../images/logo.png';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const SiteLogo = () => {
  return (
    <NavLink exact to="/" className='navbar-logo'>
      <img id='site-logo' src={logo} alt='logo' />
    </NavLink>
  )
};

export default SiteLogo;
