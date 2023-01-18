// frontend/src/components/Navigation/index.js
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import SiteLogo from './SiteLogo';
import NotificationButton from './NotificationButton';
import MessagesButton from './MessagesButton';
import { thunkLoadGroups } from '../../store/groups';
import { thunkLoadEvents } from '../../store/events';

function Navigation({ isLoaded }) {
  let hide = '';
  const sessionUser = useSelector(state => state.session.user);
  if (!sessionUser) hide = ' hidden';

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadEvents()).then(() => dispatch(thunkLoadGroups()));
  }, [ dispatch ]);

  return (
    <nav>
      <div className='navbar'>
        <SiteLogo key='nav-1' />
        <ul className='nav-buttons-wrapper'>
          {isLoaded && (
            <>
              <li key='nav-2' className={'nav-button'.concat(hide)}>
                <NavLink to='/messages'>
                  <MessagesButton id='messages-button' user={sessionUser} />
                </NavLink>
              </li>
              <li key='nav-3' className={'nav-button'.concat(hide)}>
                <NavLink to='/notifications'>
                  <NotificationButton id='notifications-button' />
                </NavLink>
              </li>
              <li key='nav-4' className='nav-button'>
                <ProfileButton id='profile-button' user={sessionUser} />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
