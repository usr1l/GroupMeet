import React, { useEffect } from "react"
import { useParams, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkDeleteEvent, thunkLoadSingleEvent } from "../../store/events";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import IconDescriptionCard from "../IconDescriptionCard";
import Button from "../Button";
import NotFoundPage from "../NotFoundPage";
import './SingleEventPage.css';
import convertDate from '../HelperFns/ConvertDate';


const SingleEventPage = ({ eventData }) => {

  const { eventId } = useParams();
  if (isNaN(parseInt(eventId))) return (<NotFoundPage />)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadSingleEvent(eventId));
  }, [ dispatch, eventId ]);

  const { user } = useSelector(state => state.session);
  const eventState = useSelector(state => state.events);

  if (eventState.status === true) return (<div>Loading...</div>);

  const event = useSelector(state => state.events.event);
  if (!event) return (<div>Not Found</div>);
  const { name, startDate, endDate, groupId, description, previewImage } = event;
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

  let startDateSlice;
  let startTimeSlice;
  let endDateSlice;
  let endTimeSlice;
  if (startDate) {
    startDateSlice = convertDate(startDate);
    startTimeSlice = startDate.slice(10);
  };

  if (endDate) {
    endDateSlice = convertDate(endDate);
    endTimeSlice = endDate.slice(10);
  };

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
            iconClass="fas fa-user-circle"
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
              <IconDescriptionCard
                iconClass="fa-regular fa-clock"
                heading={`${startDateSlice} ${startTimeSlice} TO`}
                subHeading={`${endDateSlice} ${endTimeSlice}`}
              />
            </section>
          </div>
        </div>
        <div></div>
        <div className="event-page-footer">
          <div className="event-page-footer-buffer">
            <div className="event-page-footer-container">
              <div className="event-page-footertext">
                {`${startDateSlice} ${startTimeSlice}`}
                <br></br>
                {name}
              </div>
              <div>
                {organizerBool && (
                  <section className="event-page-footer-buttons">
                    <NavLink to={`/events/${eventId}/edit`} id='event-edit-navlink'>
                      <Button buttonStyle='btn--big' buttonSize='btn--large' onClick={(e) => e.preventDefault} >Edit</Button>
                    </NavLink>
                    <Button buttonStyle='btn--delete' buttonSize='btn--large' onClick={handleDelete}>Delete</Button>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SingleEventPage;
