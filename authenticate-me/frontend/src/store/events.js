import { csrfFetch } from "./csrf";
import normalizeFn from "../components/HelperFns/NormalizeFn";
import objDeepCopyFn from "../components/HelperFns/ObjDeepCopyFn";

const LOAD_EVENTS = 'events/LOAD';
const DELETE_EVENT = 'events/DELETE';
const CREATE_EVENT = 'events/CREATE';
const UPDATE_EVENT = 'events/EDIT';

export const thunkLoadEvents = () => async (dispatch) => {
  const response = await csrfFetch('/api/events/');
  const data = await response.json();
  dispatch(actionLoadEvents(data));
};

export const actionLoadEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    payload: events
  };
};

export const actionDeleteEvent = (id) => {
  return {
    type: DELETE_EVENT,
    payload: id
  };
};

export const actionUpdateEvent = (id) => {
  return {
    type: CREATE_EVENT,
    payload: id
  };
};

export const actionCreateEvent = (event) => {
  return {
    type: UPDATE_EVENT,
    payload: event
  };
};


const initialState = { events: {}, isLoading: true };

const eventReducer = (state = initialState, action) => {

  switch (action.type) {
    case LOAD_EVENTS:
      const events = normalizeFn(action.payload.Events);
      const eventsCopy = objDeepCopyFn(events)
      return { ...state, events: eventsCopy, isLoading: false };
    case CREATE_EVENT:
      return state;
    case DELETE_EVENT:
      return state;
    case UPDATE_EVENT:
      return state;
    default:
      return state;
  };
};

export default eventReducer;
