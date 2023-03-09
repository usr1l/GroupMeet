import { csrfFetch } from "./csrf";
import normalizeFn from "../components/HelperFns/NormalizeFn";
import objDeepCopyFn from "../components/HelperFns/ObjDeepCopyFn";


const LOAD_GROUPS = 'groups/LOAD';
const LOAD_GROUP = 'group/LOAD';
const LOAD_GROUP_EVENTS = 'group/events/LOAD';
const LOAD_GROUP_MEMBERS = 'group/members/LOAD';
const LOAD_USER_STATUS = 'group/status/LOAD';
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

export const thunkLoadGroupEvents = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);

  if (response.ok) {
    const data = await response.json();
    const { Events } = data;
    dispatch(actionLoadGroupEvents(Events));
    return Events;
  }
};

export const thunkLoadGroupMembers = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/members`);
  if (response.ok) {
    const members = await response.json();
    dispatch(actionLoadGroupMembers(members));
    return members;
  };

  return;
};

export const thunkLoadUserStatus = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership/status`);

  if (response.ok) {
    const status = await response.json();
    dispatch(actionLoadUserStatus(status));
    return status;
  }

  return;
};


export const thunkDeleteGroup = ({ groupId }) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  })
    .catch(err => err);

  if (response.ok) {
    dispatch(actionDeleteGroup(groupId));
  };

  return response;
}

export const thunkCreateGroup = (groupInfo) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groupInfo)
  })
    .catch(err => err);

  const data = await response.json();

  if (response.ok) {
    await dispatch(actionCreateGroup(data));
  };

  return data;
};

export const thunkLoadSingleGroup = (groupId) => async (dispatch) => {

  const response = await csrfFetch(`/api/groups/${groupId}`)
    .catch(err => err);

  if (response.ok) {
    const data = await response.json();
    dispatch(actionLoadSingleGroup(data));
    return data;
  };

  return response;
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
    dispatch(thunkLoadGroups());
    return response;
  };
};

export const actionLoadGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    payload: groups
  };
};

export const actionLoadGroupEvents = (events) => {
  return {
    type: LOAD_GROUP_EVENTS,
    payload: events
  };
};

const actionLoadGroupMembers = (members) => {
  return {
    type: LOAD_GROUP_MEMBERS,
    payload: members
  }
}

const actionLoadUserStatus = (status) => {
  return {
    type: LOAD_USER_STATUS,
    payload: status
  };
};

const actionLoadSingleGroup = (group) => {
  return {
    type: LOAD_GROUP,
    payload: group
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
  const updatedState = {
    ...state,
    groups: { ...state.groups },
    group: {
      ...state.group,
      Events: { ...state.group.Events },
      GroupImages: { ...state.group.GroupImages },
      Organizer: { ...state.group.Organizer },
      Venues: { ...state.group.Venues },
      Members: { ...state.group.Members },
    }
  };

  switch (action.type) {
    case LOAD_GROUPS:
      const groups = normalizeFn(action.payload.Groups);
      return { ...state, groups: groups, isLoading: false };
    case LOAD_GROUP:
      const group = objDeepCopyFn(action.payload);
      return { ...state, group: group };
    case LOAD_GROUP_EVENTS:
      const events = normalizeFn(action.payload);
      updatedState.group.Events = events;
      return updatedState;
    case LOAD_GROUP_MEMBERS:
      const members = normalizeFn(action.payload);
      updatedState.group.Members = members;
      return updatedState;
    case LOAD_USER_STATUS:
      const status = action.payload;
      updatedState.group.userStatus = status;
      return updatedState;
    case CREATE_GROUP:
      const newGroupId = action.payload.id;
      updatedState[ 'groups' ][ newGroupId ] = { ...action.payload };
      return updatedState;
    case DELETE_GROUP:
      const id = action.payload;
      delete updatedState[ 'groups' ][ id ];
      return updatedState;
    case UPDATE_GROUP:
      const updateGroup = { ...action.payload };
      const updateGroupId = updateGroup.id;
      updatedState.groups[ updateGroupId ] = updateGroup;
      return updatedState;
    default:
      return updatedState;
  };
};

export default groupReducer;
