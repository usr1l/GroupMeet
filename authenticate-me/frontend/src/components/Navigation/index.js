// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import SiteLogo from './SiteLogo';
import NotificationButton from './NotificationButton';
import MessagesButton from './MessagesButton';

function Navigation({ isLoaded }) {
  let hide = '';
  const sessionUser = useSelector(state => state.session.user);
  if (!sessionUser) hide = ' hidden';


  return (
    <nav>
      <div className='navbar'>
        <div>
          <NavLink exact to="/">
            <SiteLogo />
          </NavLink>
        </div>
        <ul className='nav-buttons-wrapper'>
          {isLoaded && (
            <>
              <li id='messages-button' className={'nav-button' + `${hide}`}>
                <NavLink to='/messages'>
                  <MessagesButton user={sessionUser} />
                </NavLink>
              </li>
              <li id='notifications-button' className={'nav-button' + `${hide}`}>
                <NavLink to='/notifications'>
                  <NotificationButton user={sessionUser} />
                </NavLink>
              </li>
              <li id='profile-button' className='nav-button'>
                <ProfileButton user={sessionUser} />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
