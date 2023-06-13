// frontend/src/components/Navigation/index.js
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import SiteLogo from './SiteLogo';
import NotificationButton from './NotificationButton';
import MessagesButton from './MessagesButton';
import './Navigation.css';


function Navigation({ isLoaded }) {
  // const [ click, setClick ] = useState(false);
  const [ button, setButton ] = useState(true);

  // const handleClick = () => setClick(!click);
  const showButton = () => {
    if (window.innerWidth <= 650) {
      setButton(false);
    } else {
      setButton(true);
    };
  };

  useEffect(() => {
    showButton();
  }, []);


  window.addEventListener('resize', showButton);

  let divClassName = 'nav-buttons-wrapper';
  const sessionUser = useSelector(state => state.session.user);
  if (!sessionUser) {
    divClassName = 'hide-nav-items';
  }

  return (

    <nav className='navbar'>
      <div className='navbar-container'>
        <SiteLogo />
        <div className='nav-buttons'>
          {sessionUser && (
            <>
              <div key='nav-2' className='nav-item' id='create-group-div'>
                <NavLink className='navbar-button' id='create-group' to='/groups/new'>
                  Create Group
                </NavLink>
              </div>
              <div id='create-group-break'></div>
            </>
          )}
          <ul className={`${divClassName}`}>
            {isLoaded && (
              <>
                {/* {sessionUser && button && (
                  <>
                    <li key='nav-3' className={`nav-item`}>
                      <MessagesButton />
                    </li>
                    <li key='nav-4' className={`nav-item`}>
                      <NotificationButton />
                    </li>
                  </>
                )} */}
                <li key='nav-5' className={`nav-item`}>
                  <ProfileButton user={sessionUser} />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>

  );
}

export default Navigation;
