import { csrfFetch } from "./csrf";
import normalizeFn from "../components/HelperFns/NormalizeFn";

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
  switch (action.type) {
    case LOAD_GROUPS:
      const groups = normalizeFn(action.payload.Groups);
      return { ...state, groups: groups, isLoading: false };
    case CREATE_GROUP:
      return initialState;
    case DELETE_GROUP:
      return initialState;
    case UPDATE_GROUP:
      return initialState;
    default:
      return initialState;
  };
};

export default groupReducer;
