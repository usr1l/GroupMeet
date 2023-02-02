import { csrfFetch } from "./csrf";
import normalizeFn from "../components/HelperFns/NormalizeFn";
import objDeepCopyFn from "../components/HelperFns/ObjDeepCopyFn";


const LOAD_EVENTS = 'events/LOAD';
const LOAD_EVENT = 'event/LOAD';
const DELETE_EVENT = 'events/DELETE';
const CREATE_EVENT = 'events/CREATE';
const UPDATE_EVENT = 'events/EDIT';


export const thunkLoadEvents = () => async (dispatch) => {
  const response = await csrfFetch('/api/events/');

  if (response.ok) {
    const data = await response.json();
    dispatch(actionLoadEvents(data));
    return data;
  }
};

export const thunkDeleteEvent = ({ user, eventId }) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE',
    body: JSON.stringify({
      user
    })
  })
    .catch(err => err);

  if (response.ok) {
    dispatch(actionDeleteEvent(eventId));
  };

  return response
};

export const thunkCreateEvent = (eventInfo) => async (dispatch) => {

  const {
    name,
    description,
    type,
    price,
    capacity,
    startDate,
    endDate,
    previewImage,
    groupId
  } = eventInfo;


  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description,
      type,
      price,
      capacity,
      startDate,
      endDate,
      previewImage
    })
  })
    .catch(err => err)

  if (response.ok) {
    const data = await response.json();
    await dispatch(actionCreateEvent(data));
    return data;
  };
};

export const thunkLoadSingleEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`)
    .catch(err => err);

  if (response.ok) {
    const data = await response.json();
    dispatch(actionLoadSingleEvent(data));
    return data;
  };

  return response;
};

export const thunkUpdateEvent = (eventInfo, eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventInfo)
  })
    .catch(err => err)

  if (response.ok) {
    const data = await response.json();
    dispatch(actionUpdateEvent(data));
    return response;
  };
};

export const actionLoadEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    payload: events
  };
};

const actionLoadSingleEvent = (event) => {
  return {
    type: LOAD_EVENT,
    payload: event
  };
};

export const actionDeleteEvent = (id) => {
  return {
    type: DELETE_EVENT,
    payload: id
  };
};

export const actionUpdateEvent = (event) => {
  return {
    type: UPDATE_EVENT,
    payload: event
  };
};


export const actionCreateEvent = (event) => {
  return {
    type: UPDATE_EVENT,
    payload: event
  };
};


const initialState = { events: {}, event: {}, isLoading: true };

const eventReducer = (state = initialState, action) => {
  const updatedState = { ...state, events: { ...state.events }, event: { ...state.event, Group: { ...state.event.Group }, Venue: { ...state.event.Venue } } };

  switch (action.type) {
    case LOAD_EVENTS:
      const events = normalizeFn(action.payload.Events);
      const eventsCopy = objDeepCopyFn(events)
      return { ...state, events: eventsCopy, isLoading: false };
    case LOAD_EVENT:
      const event = objDeepCopyFn(action.payload.Event);
      return { ...state, event: event };
    case CREATE_EVENT:
      const newEventId = action.payload.id;
      const newEvent = objDeepCopyFn(action.payload)
      updatedState[ 'events' ][ newEventId ] = newEvent;
      return updatedState;
    case DELETE_EVENT:
      const id = action.payload;
      delete updatedState[ 'events' ][ id ];
      return updatedState;
    case UPDATE_EVENT:
      const updateEvent = objDeepCopyFn(action.payload);
      const updateEventId = updateEvent.id;
      updatedState.events[ updateEventId ] = updateEvent;
      return updatedState;
    default:
      return updatedState;
  };
};

export default eventReducer;
