import { csrfFetch } from "./csrf";

const normalizeFn = ([ data ]) => {
  const normalizeData = {};
  data.forEach((val) => normalizeData[ val.id ] = val);
  return normalizeData;
};

const LOAD_GROUPS = 'groups/LOAD';
const DELETE_GROUP = 'groups/DELETE';
const CREATE_GROUP = 'groups/CREATE';
const UPDATE_GROUP = 'groups/EDIT';

export const thunkLoadGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups/');
  const data = await response.json();
  dispatch(actionLoadGroups(data));
};

export const actionLoadGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    payload: groups
  };
};

export const actionDeleteGroup = (id) => {
  return {
    type: DELETE_GROUP,
    payload: id
  };
};

export const actionUpdateGroup = (id) => {
  return {
    type: CREATE_GROUP,
    payload: id
  };
};

export const actionCreateGroup = (group) => {
  return {
    type: UPDATE_GROUP,
    payload: group
  };
};

const initialState = { groups: {}, isLoading: true };




const groupReducer = (state = initialState, action) => {
  const updatedState = { ...state }

  switch (action.type) {
    case LOAD_GROUPS:
      console.log('GROUPS', action.payload);
      return state;
    case CREATE_GROUP:
      return state;
    case DELETE_GROUP:
      return state;
    case UPDATE_GROUP:
      return state;
    default:
      return state;
  };
};

export default groupReducer;
