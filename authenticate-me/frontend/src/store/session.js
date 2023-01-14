// frontend/src/store/session.js

import { csrfFetch } from "./csrf";


const LOGIN_USER = 'user/LOGIN_USER';
const LOGOUT_USER = 'user/LOGOUT_USER';

const actionLogin = (user) => {
  return {
    type: LOGIN_USER,
    payload: user
  };
};

const actionLogout = () => {
  return {
    type: LOGOUT_USER,
  };
};

// login
export const thunkLogin = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  const data = await response.json();
  dispatch(actionLogin(data.user));
  return response;
};

// restore user
export const thunkRestoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(actionLogin(data.user));
  return response;
};

// signup user
export const thunkSignup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(actionLogin(data.user));
  return response;
};

// logout user
export const thunkLogout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(actionLogout());
  return response;
};


const initialState = { user: null };


const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOGIN_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case LOGOUT_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
