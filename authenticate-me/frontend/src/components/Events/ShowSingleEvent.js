import React from "react"
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkDeleteEvent } from "../../store/events";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";

const SingleEventPage = ({ eventData }) => {
  const history = useHistory();
  // check for loading state
  const { user } = useSelector(state => state.session);

  const eventState = useSelector(state => state.events);
  const { eventId } = useParams();

  if (eventState.status === true) return (<div>Loading...</div>);

  // check for event
  const event = useSelector(state => state.events.events[ eventId ]);
  if (!event) return (<div>Not Found</div>);

  let { name, startDate, type, groupId, Venue } = event;

  const dispatch = useDispatch();
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
      <ul>
        <li>{name}</li>
        <li>{startDate}</li>
        <li>{type}</li>
        <li>{groupId}</li>
        <li>{Venue.state}</li>
      </ul>
      <Link to={`/events/${eventId}`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </>
  )
}

export default SingleEventPage;
