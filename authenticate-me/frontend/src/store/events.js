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

export const thunkDeleteEvent = ({ eventId }) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE'
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
    await dispatch(thunkLoadEvents());
    return data;
  };

  return response;
};

export const thunkLoadSingleEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`)
    .catch(err => err);

  if (response.ok) {
    const data = await response.json();
    await dispatch(actionLoadSingleEvent(data));
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
    dispatch(thunkLoadEvents());
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


const initialState = {
  events: {},
  event: { Group: {}, Venue: {}, EventImages: {} },
  isLoading: true
};

const eventReducer = (state = initialState, action) => {
  // const updatedState = {
  //   ...state,
  //   events: { ...state.events },
  //   event: {
  //     ...state.event,
  //     Group: { ...state.event.Group },
  //     Venue: { ...state.event.Venue }
  //   }
  // };

  switch (action.type) {
    case LOAD_EVENTS:
      const events = normalizeFn(action.payload.Events);
      return { ...state, events: events, isLoading: false };
    case LOAD_EVENT:
      return {
        ...state, event: {
          ...action.payload.Event,
          Group: { ...action.payload.Event.Group },
          Venue: { ...action.payload.Event.Venue },
          EventImages: normalizeFn(action.payload.Event.EventImages)
        }
      };
    case CREATE_EVENT:
      const newEventId = action.payload.id;
      const newEvent = { ...action.payload, Group: { ...action.payload.Group }, Venue: { ...action.payload.Venue } };
      return { ...state, events: { ...state.events, [ newEventId ]: newEvent } };
    case DELETE_EVENT:
      const id = action.payload;
      const updatedState = objDeepCopyFn(state);
      delete updatedState[ 'events' ][ id ];
      updatedState[ 'event' ] = { Group: {}, Venue: {}, EventImages: {} };
      return updatedState;
    case UPDATE_EVENT:
      const updateEvent = objDeepCopyFn(action.payload);
      const updateEventId = updateEvent.id;
      return { ...state, events: { ...state.events, [ updateEventId ]: updateEvent } };
    default:
      return { ...state };
  };
};

export default eventReducer;
