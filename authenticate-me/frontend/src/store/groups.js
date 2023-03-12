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
const JOIN_GROUP = 'group/membership/CREATE';

export const thunkLoadGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups/');

  if (response.ok) {
    const data = await response.json();
    dispatch(actionLoadGroups(data));
    return data;
  }

  return response;
};

export const thunkLoadGroupEvents = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);

  if (response.ok) {
    const data = await response.json();
    const { Events } = data;
    dispatch(actionLoadGroupEvents(Events));
    return Events;
  }

  return;
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
    dispatch(actionCreateGroup(data));
    dispatch(thunkLoadGroups());
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


export const thunkRequestMembership = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: 'POST'
  })
    .catch(err => err);

  const data = await response.json();
  if (data.status === 'pending') {
    dispatch(thunkLoadGroupMembers(groupId));
    dispatch(actionLoadUserStatus(data.status));
    return data.status;
  };

  return response;
};


export const thunkDeleteMembership = ({ groupId, memberId }) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId })
  })
    .catch(err => err);

  if (response.ok) {
    dispatch(thunkLoadGroupMembers(groupId));
    dispatch(actionLoadUserStatus(''));
    return '';
  }

  // const data = await response.json();

  return response;
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
  // const updatedState = {
  //   ...state,
  //   groups: { ...state.groups },
  //   group: {
  //     ...state.group,
  //     Events: { ...state.group.Events },
  //     GroupImages: { ...state.group.GroupImages },
  //     Organizer: { ...state.group.Organizer },
  //     Venues: { ...state.group.Venues },
  //     Members: { ...state.group.Members },
  //   }
  // };

  switch (action.type) {
    case LOAD_GROUPS:
      const groups = normalizeFn(action.payload.Groups);
      return { ...state, groups: groups, isLoading: false };
    case LOAD_GROUP:
      return { ...state, group: { ...action.payload } };
    case LOAD_GROUP_EVENTS:
      const events = normalizeFn(action.payload);
      return { ...state, group: { ...state.group, Events: events } };
    case LOAD_GROUP_MEMBERS:
      const members = normalizeFn(action.payload);
      return { ...state, group: { ...state.group, Members: members } };
    case LOAD_USER_STATUS:
      const status = action.payload;
      return { ...state, group: { ...state.group, userStatus: status } };
    case CREATE_GROUP:
      const newGroupId = action.payload.id;
      return { ...state, groups: { ...state.groups, [ newGroupId ]: { ...action.payload } } };
    case DELETE_GROUP:
      const id = action.payload;
      const updatedState = objDeepCopyFn(state);
      delete updatedState[ 'groups' ][ id ];
      return updatedState;
    case UPDATE_GROUP:
      const updateGroup = { ...action.payload };
      const updateGroupId = updateGroup.id;
      return { ...state, groups: { ...state.groups, [ updateGroupId ]: updateGroup } };
    default:
      return { ...state };
  };
};

export default groupReducer;
