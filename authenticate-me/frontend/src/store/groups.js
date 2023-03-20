import { csrfFetch } from "./csrf";
import normalizeFn from "../components/HelperFns/NormalizeFn";
import objDeepCopyFn from "../components/HelperFns/ObjDeepCopyFn";
import { thunkLoadUserMemberships } from "./session";
import { thunkLoadEvents } from "./events";


const LOAD_GROUPS = 'groups/LOAD';
const LOAD_GROUP = 'group/LOAD';
const LOAD_GROUP_EVENTS = 'group/events/LOAD';
const LOAD_GROUP_MEMBERS = 'group/members/LOAD';
const DELETE_GROUP = 'groups/DELETE';
const CREATE_GROUP = 'groups/CREATE';
const UPDATE_GROUP = 'groups/EDIT';
// const UPDATE_MEMBERSHIP = 'groups/membership/UPDATE';
const CREATE_MEMBERSHIP = 'groups/membership/CREATE';
const DELETE_MEMBERSHIP = 'groups/membership/DELETE';
// const JOIN_GROUP = 'group/membership/CREATE';

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


export const thunkDeleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  })
    .catch(err => err);

  if (response.ok) {
    dispatch(actionDeleteGroup(groupId));
    dispatch(thunkLoadEvents());
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
    dispatch(thunkLoadUserMemberships());
  };

  return data;
};

export const thunkLoadSingleGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`)
    .catch(err => err);

  const data = await response.json();
  if (response.ok) {
    dispatch(actionLoadSingleGroup(data));
    return data;
  };

  return data;
};


export const thunkUpdateGroup = (groupInfo, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(groupInfo)
  })
    .catch(err => err);

  const data = await response.json();
  if (response.ok) {
    dispatch(actionUpdateGroup(data));
    dispatch(thunkLoadGroups());
    return response;
  };

  return data;
};


// export const thunkGroupRequestMembership = (groupId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
//     method: 'POST'
//   })
//     .catch(err => err);

//   const data = await response.json();
//   if (data.status === 'pending') {
//     dispatch(thunkLoadGroupMembers(groupId));
//     dispatch(actionLoadUserStatus(data.status));
//     return data.status;
//   };

//   return response;
// };


export const thunkGroupDeleteMembership = ({ groupId, memberId, removeBool }) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId })
  })
    .catch(err => err);

  if (response.ok) {
    dispatch(actionGroupDeleteMembership({ groupId, memberId, removeBool }));
    return;
  }

  return response;
};


export const thunkGroupAcceptMembership = ({ groupId, memberId, statusChange }) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/membership`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberId: memberId,
      status: statusChange
    })
  })
    .catch(err => err);


  if (response.ok) {
    const membershipData = await response.json();
    dispatch(actionGroupAcceptMembership(membershipData));
    return membershipData;
  };

  return response;
};

const actionGroupDeleteMembership = (deleteData) => {
  return {
    type: DELETE_MEMBERSHIP,
    payload: deleteData
  }
}

const actionGroupAcceptMembership = (membershipData) => {
  return {
    type: CREATE_MEMBERSHIP,
    payload: membershipData
  };
};

const actionLoadGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    payload: groups
  };
};

const actionLoadGroupEvents = (events) => {
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

const initialState = {
  groups: {},
  group: { Events: {}, GroupImages: {}, Organizer: {}, Venues: {}, Members: {} },
  isLoading: true
};


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

  let updatedState;
  switch (action.type) {
    case LOAD_GROUPS:
      const groups = normalizeFn(action.payload.Groups);
      return { ...state, groups: groups, isLoading: false };
    case LOAD_GROUP:
      return {
        ...state,
        group: {
          ...action.payload,
          Venues: normalizeFn(action.payload.Venues),
          GroupImages: normalizeFn(action.payload.GroupImages)
        }
      };
    case LOAD_GROUP_EVENTS:
      const events = normalizeFn(action.payload);
      return { ...state, group: { ...state.group, Events: events } };
    case LOAD_GROUP_MEMBERS:
      const members = normalizeFn(action.payload);
      return { ...state, group: { ...state.group, Members: members } };
    case CREATE_GROUP:
      const newGroupId = action.payload.id;
      return { ...state, groups: { ...state.groups, [ newGroupId ]: { ...action.payload, numMembers: 1 } } };
    case DELETE_GROUP:
      const id = action.payload;
      updatedState = objDeepCopyFn(state);
      delete updatedState[ 'groups' ][ id ];
      updatedState[ 'group' ] = { Events: {}, GroupImages: {}, Organizer: {}, Venues: {}, Members: {} };
      return updatedState;
    case UPDATE_GROUP:
      const updateGroup = { ...action.payload };
      const updateGroupId = updateGroup.id;
      return { ...state, groups: { ...state.groups, [ updateGroupId ]: updateGroup } };
    case CREATE_MEMBERSHIP:
      const membershipData = action.payload;
      return {
        ...state,
        groups: {
          ...state.groups,
          [ membershipData.groupId ]: {
            ...state.groups[ membershipData.groupId ],
            numMembers: ++state.groups[ membershipData.groupId ].numMembers
          }
        },
        group: {
          ...state.group,
          Members: {
            ...state.group.Members,
            [ membershipData.memberId ]: {
              ...state.group.Members[ membershipData.memberId ],
              memberStatus: membershipData.status
            }
          }
        }
      };
    case DELETE_MEMBERSHIP:
      const { groupId, removeBool, memberId } = action.payload;
      updatedState = {
        ...state,
        groups: {
          ...state.groups,
          [ groupId ]: {
            ...state.groups[ groupId ],
            numMembers: removeBool ? --state.groups[ groupId ].numMembers : state.groups[ groupId ].numMembers
          }
        },
        group: {
          ...state.group,
          Members: { ...state.group.Members }
        }
      };
      delete updatedState.group.Members[ memberId ];
      return updatedState;
    default:
      return state;
    // break;
  };
};

export default groupReducer;
