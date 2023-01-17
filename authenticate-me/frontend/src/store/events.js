

const LOAD_EVENTS = 'events/LOAD';
const DELETE_EVENT = 'events/DELETE';
const CREATE_EVENT = 'events/CREATE';
const UPDATE_EVENT = 'events/EDIT';


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


const initialState = {};

const eventReducer = (state = initialState, action) => {
  const updatedState = { ...state };

  switch (action.type) {
    case LOAD_EVENTS:
      return state;
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
