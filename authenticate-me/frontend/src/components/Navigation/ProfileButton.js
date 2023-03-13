// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link, useHistory } from 'react-router-dom';

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [ showMenu, setShowMenu ] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [ showMenu ]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.thunkLogout());
    closeMenu();
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <i className="fas fa-user-circle navbar-button" id='profile-button' onClick={openMenu} />
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div id='profile-menu'>
            <li className='modal-menu-item' id='modal-menu-item-greeting'>Hello, {user.firstName}!</li>
            <li className='modal-menu-item'>{user.username}</li>
            <li className='modal-menu-item'>{user.email}</li>
            <div className="menu-div"></div>
            <div id='profile-menu-links-wrapper'>
              <Link className="profile-menu-link" to={'/groups'}>See All Groups</Link>
              <Link className="profile-menu-link" to={'/events'}>Find Events</Link>
            </div>
            <div className="menu-div"></div>
            <button className="btn btn--menu-item btn--menu" onClick={logout}>Log Out</button>
          </div>
        ) : (
          <div id='profile-menu'>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
