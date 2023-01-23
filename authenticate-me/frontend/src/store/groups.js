import { csrfFetch } from "./csrf";
import normalizeFn from "../components/HelperFns/NormalizeFn";
import { thunkLoadEvents } from "./events";
import objDeepCopyFn from "../components/HelperFns/ObjDeepCopyFn";

const LOAD_GROUPS = 'groups/LOAD';
const LOAD_GROUP = 'group/LOAD'
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

  if (response.ok) {
    dispatch(actionDeleteGroup(groupId));
    dispatch(thunkLoadEvents());
  };

  return response;
}

export const thunkCreateGroup = (groupInfo) => async (dispatch) => {
  const { name, about, type, isPrivate, city, state, organizerId, previewImage } = groupInfo
  const response = await csrfFetch(`/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      about,
      type,
      private: isPrivate,
      city,
      state,
      organizerId,
      previewImage
    })
  })
    .catch(err => err)

  if (response.ok) {
    const data = await response.json();
    await dispatch(actionCreateGroup(data));
    return data;
  }
}

export const thunkLoadSingleGroup = (groupId) => async (dispatch) => {

  const response = await csrfFetch(`/api/groups/${groupId}`)
    .catch(err => err);

  if (response.ok) {
    const data = await response.json();
    dispatch(actionLoadSingleGroup(data));
  };
};

export const thunkUpdateGroup = (groupInfo, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(groupInfo)
  })
    .catch(err => err);

  if (response.ok) {
    const data = await response.json();
    dispatch(actionUpdateGroup(data));
    return response;
  };
};

export const actionLoadGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    payload: groups
  };
};

const actionLoadSingleGroup = (group) => {
  return {
    type: LOAD_GROUP,
    payload: group
  }
}

export const actionDeleteGroup = (id) => {
  return {
    type: DELETE_GROUP,
    payload: id
  };
};

export const actionUpdateGroup = (group) => {
  return {
    type: UPDATE_GROUP,
    payload: group
  };
};

export const actionCreateGroup = (group) => {
  return {
    type: CREATE_GROUP,
    payload: group
  };
};

const initialState = { groups: {}, group: {}, isLoading: true };


const groupReducer = (state = initialState, action) => {
  const updatedState = { ...state, groups: { ...state.groups }, group: { ...state.group, GroupImages: { ...state.group.GroupImages }, Organizer: { ...state.group.Organizer }, Venues: { ...state.group.Venues } } };
  switch (action.type) {
    case LOAD_GROUPS:
      const groups = normalizeFn(action.payload.Groups);
      return { ...state, groups: groups, isLoading: false };
    case LOAD_GROUP:
      const group = objDeepCopyFn(action.payload);
      return { ...state, group: group }
    case CREATE_GROUP:
      const newGroupId = action.payload.id;
      updatedState[ 'groups' ][ newGroupId ] = action.payload;
      return updatedState;
    case DELETE_GROUP:
      const id = action.payload;
      delete updatedState[ 'groups' ][ id ];
      return updatedState;
    case UPDATE_GROUP:
      const updateGroup = objDeepCopyFn(action.payload);
      const updateGroupId = updateGroup.id;
      updatedState.groups[ updateGroupId ] = updateGroup;
      return updatedState;
    default:
      return updatedState;
  };
};

export default groupReducer;
