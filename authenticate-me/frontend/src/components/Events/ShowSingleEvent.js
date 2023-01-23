import React, { useEffect, } from "react"
import { useParams, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkDeleteEvent, thunkLoadSingleEvent } from "../../store/events";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";


const SingleEventPage = ({ eventData }) => {

  const { eventId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkLoadSingleEvent(eventId));
  }, [ dispatch, eventId ]);


  // const [ currEventId, setCurrEventId ] = useState(eventId);
  const { user } = useSelector(state => state.session);

  const eventState = useSelector(state => state.events);

  if (eventState.status === true) return (<div>Loading...</div>);
  const event = useSelector(state => state.events.event);

  const history = useHistory();

  // check for loading state

  // check for event
  if (!event) return (<div>Not Found</div>);

  const { name, startDate, type, groupId, previewImage } = event;

  const group = useSelector(state => state.groups.groups[ groupId ]);

  const organizerId = group ? group.organizerId : null;

  const organizerBool = organizerId === user.id;

  const handleDelete = async (e) => {
    e.preventDefault();
    const data = await dispatch(thunkDeleteEvent({ user, eventId }))
    if (data.ok === true) {
      history.push(`/events`);
    };

    if (data.ok === false) {
      errorPageHandler(data);
    };
  };

  return (
    <>
      <div>SingleEventPage</div>
      <img src={previewImage} alt='preview' />
      <ul>
        <li>{name}</li>
        <li>{startDate}</li>
        <li>{type}</li>
        <li>{groupId}</li>
      </ul>
      {organizerBool && (
        <>
          <NavLink to={`/events/${eventId}/edit`}>Edit</NavLink>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </>
  )
}

export default SingleEventPage;
