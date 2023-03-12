import { csrfFetch } from "./csrf";
import normalizeFn from "../components/HelperFns/NormalizeFn";

const LOGIN_USER = 'user/LOGIN_USER';
const LOGOUT_USER = 'user/LOGOUT_USER';
const LOAD_USER_MEMBERSHIPS = 'user/LOAD_USER_MEMBERSHIPS';

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

const actionLoadUserMemberships = (memberships) => {
  return {
    type: LOAD_USER_MEMBERSHIPS,
    payload: memberships
  };
};

export const thunkLoadUserMemberships = () => async (dispatch) => {
  const response = await csrfFetch('/api/memberships/current');
  const data = await response.json();
  dispatch(actionLoadUserMemberships(data));
  return response;
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


const initialState = { user: null, memberships: {} };


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
    case LOAD_USER_MEMBERSHIPS:
      newState = Object.assign({}, state);
      const memberships = action.payload;
      newState.memberships = normalizeFn(memberships);
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
