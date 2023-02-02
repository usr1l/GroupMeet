import React, { useEffect } from "react"
import { useParams, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkDeleteEvent, thunkLoadSingleEvent } from "../../store/events";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import './SingleEventPage.css';


const SingleEventPage = ({ eventData }) => {

  const { eventId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadSingleEvent(eventId));
  }, [ dispatch, eventId ]);

  const { user } = useSelector(state => state.session);
  const eventState = useSelector(state => state.events);

  if (eventState.status === true) return (<div>Loading...</div>);

  const event = useSelector(state => state.events.event);
  if (!event) return (<div>Not Found</div>);
  const { name, startDate, type, groupId, description, previewImage } = event;

  const history = useHistory();



  const group = useSelector(state => state.groups.groups[ groupId ]);
  const organizerId = group ? group.organizerId : null;

  const organizerFn = () => {
    if (user) {
      return organizerId === user.id
    };
    return false;
  };

  const organizerBool = organizerFn(user);

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
      <div className="event-page-container">
        <img src={previewImage} alt='preview' className="event-page-image" />
        <ul className="event-page-info">
          <li className="event-page-info-item">{name}</li>
          <li className="event-page-info-item">{startDate}</li>
          <li className="event-page-info-item">{type}</li>
          <li className="event-page-info-item">{groupId}</li>
          <div className="event-page-info-item">{description}</div>
        </ul>
        {organizerBool && (
          <>
            <NavLink to={`/events/${eventId}/edit`} className="event-page-edit-btn">Edit</NavLink>
            <button onClick={handleDelete} className="event-page-delete-btn">Delete</button>
          </>
        )}
      </div>
    </>
  )
}

export default SingleEventPage;
