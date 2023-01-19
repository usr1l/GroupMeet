import { csrfFetch } from "./csrf";
import normalizeFn from "../components/HelperFns/NormalizeFn";
import { thunkLoadEvents } from "./events";

const LOAD_GROUPS = 'groups/LOAD';
const DELETE_GROUP = 'groups/DELETE';
const CREATE_GROUP = 'groups/CREATE';
const UPDATE_GROUP = 'groups/EDIT';

export const thunkLoadGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups/');

  if (response.ok) {
    const data = await response.json();
    dispatch(actionLoadGroups(data));
    return data;
  }
};

export const thunkDeleteGroup = ({ user, groupId }) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
    body: JSON.stringify({
      user
    })
  })
    .catch(err => err);
  console.log('this')
  if (response.ok) {
    dispatch(actionDeleteGroup(groupId));
    dispatch(thunkLoadEvents());
  };

  return response;
}

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

export const actionUpdateGroup = (group) => {
  return {
    type: CREATE_GROUP,
    payload: group
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
      return { ...state };
    case DELETE_GROUP:
      const id = action.payload;
      const updatedState = { ...state };
      delete updatedState[ 'groups' ][ id ];
      return updatedState;
    case UPDATE_GROUP:
      return { ...state };
    default:
      return { ...state };
  };
};

export default groupReducer;
