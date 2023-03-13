import { csrfFetch } from "./csrf";

const LOGIN_USER = 'user/LOGIN_USER';
const LOGOUT_USER = 'user/LOGOUT_USER';
const LOAD_USER_MEMBERSHIPS = 'user/USER_MEMBERSHIPS/LOAD';
const DELETE_MEMBERSHIP = 'user/MEMBERSHIPS/DELETE';
const REQUEST_MEMBERSHIP = 'user/REQUEST_MEMBERSHIP/CREATE';

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

const actionDeleteMembership = (data) => {
  return {
    type: DELETE_MEMBERSHIP,
    payload: data
  }
}

const actionRequestMembership = (data) => {
  return {
    type: REQUEST_MEMBERSHIP,
    payload: data
  }
}

export const thunkLoadUserMemberships = () => async (dispatch) => {
  const response = await csrfFetch('/api/memberships/current');
  const data = await response.json();
  dispatch(actionLoadUserMemberships(data));
  return response;
};

export const thunkSessionRequestMembership = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: 'POST'
  })
    .catch(err => err);

  const data = await response.json();
  if (data.status === 'pending') {
    dispatch(actionRequestMembership(data));
    return data.status;
  };

  return response;
};

export const thunkSessionDeleteMembership = ({ groupId, memberId }) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId })
  })
    .catch(err => err);

  if (response.ok) {
    dispatch(actionDeleteMembership(groupId));
    return '';
  }

  // const data = await response.json();

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
  // let currUser;
  let newState;
  switch (action.type) {
    case LOGIN_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case LOGOUT_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      newState.memberships = {};
      return newState;
    case LOAD_USER_MEMBERSHIPS:
      newState = Object.assign({}, state);
      const membershipsArr = action.payload;
      const memberships = {};
      membershipsArr.forEach(ele => {
        memberships[ ele.groupId ] = ele;
      });
      newState.memberships = memberships;
      return newState;
    case DELETE_MEMBERSHIP:
      newState = { ...state, memberships: { ...state.memberships } };
      const groupId = action.payload;
      delete newState.memberships[ groupId ];
      return newState;
    case REQUEST_MEMBERSHIP:
      newState = Object.assign({}, state);
      const data = action.payload;
      // currUser = { id: data.id, firstName: data.firstName, lastName: data.lastName, memberStatus: data.status }
      return {
        ...state,
        memberships: {
          ...state.memberships,
          [ data.groupId ]: { ...data },
        }
      }
    default:
      return state;
  }
};

export default sessionReducer;
