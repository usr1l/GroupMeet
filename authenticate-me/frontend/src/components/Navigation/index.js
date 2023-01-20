// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import SiteLogo from './SiteLogo';
import NotificationButton from './NotificationButton';
import MessagesButton from './MessagesButton';
import { thunkLogin } from '../../store/session';
import { useDispatch } from 'react-redux';


function Navigation({ isLoaded }) {
  let hide = '';
  const sessionUser = useSelector(state => state.session.user);
  if (!sessionUser) hide = ' hidden';
  const dispatch = useDispatch();

  const demoUser = async () => {
    const user = {
      credential: 'Demo-lition',
      password: 'password'
    };

    const response = dispatch(thunkLogin(user));
    return response;
  }

  return (
    <nav>
      <div className='navbar'>
        <SiteLogo key='nav-1' />
        <ul className='nav-buttons-wrapper'>
          {isLoaded && (
            <>{sessionUser && (
              <li key='nav-2'>
                <NavLink to='/groups/new'>
                  Create a Group
                </NavLink>
              </li>
            )}
              <li key='nav-3' className={'nav-button'.concat(hide)}>
                <NavLink to='/messages'>
                  <MessagesButton id='messages-button' user={sessionUser} />
                </NavLink>
              </li>
              <li key='nav-4' className={'nav-button'.concat(hide)}>
                <NavLink to='/notifications'>
                  <NotificationButton id='notifications-button' />
                </NavLink>
              </li>
              <li key='nav-5' className='nav-button'>
                <ProfileButton id='profile-button' user={sessionUser} />
              </li>
              {!sessionUser && (
                <button onClick={demoUser}>Demo-User</button>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
