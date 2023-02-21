import React, { useEffect } from "react"
import { useParams, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkDeleteEvent, thunkLoadSingleEvent } from "../../store/events";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import IconDescriptionCard from "../IconDescriptionCard";
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
  const groupType = event.Group.private === true ? 'Public group' : 'Private group';
  const groupName = event.Group.name;

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
      <div id='event-header-background'>
        <div className="event-page-header">
          <h2>{name}</h2>
          <IconDescriptionCard
            iconClass="fas fa-user-circle navbar-button"
            iconId='profile-button'
            heading='Hosted By'
            subHeading={`${user.firstName} ${user.lastName[ 0 ]}.`}
          />
        </div>
      </div>
      <div className="event-page-container">
        <div className="event-page-content">
          <div className="event-page-details">
            <section className="event-page-image-container">
              <img src={previewImage} alt='preview' className="event-page-image" />
            </section>
            <div className="event-page-info">
              <h3>Details</h3>
              <div className="event-page-info-item">{description}</div>
            </div>
          </div>
          <div className="event-page-sticky-div">
            <section className="event-page-icon-card-section">
              <IconDescriptionCard
                iconClass="fas fa-user-circle"
                heading={groupName}
                subHeading={groupType}
              />
              <div></div>
              <div></div>
            </section>
          </div>
        </div>
        <div className="event-page-footer">
          <div className="event-page-footer-container">
            <div>
              {startDate}
              <br></br>
              {name}
            </div>
          </div>
          <div>
            {organizerBool && (
              <>
                <NavLink to={`/events/${eventId}/edit`} className="event-page-edit-btn">Edit</NavLink>
                <button onClick={handleDelete} className="event-page-delete-btn">Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SingleEventPage;
