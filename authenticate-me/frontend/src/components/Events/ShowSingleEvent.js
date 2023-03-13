import React, { useEffect, useState } from "react"
import { useParams, NavLink, Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkDeleteEvent, thunkLoadSingleEvent } from "../../store/events";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import IconDescriptionCard from "../IconDescriptionCard";
import Button from "../Button";
import NotFoundPage from "../NotFoundPage";
import BottomNav from "../BottomNav";
import convertDate from '../HelperFns/ConvertDate';
import './SingleEventPage.css';

const SingleEventPage = ({ eventData }) => {
  const { user, memberships } = useSelector(state => state.session);
  if (!user) return <Redirect to='/events' />

  const event = useSelector(state => state.events.event);

  const { eventId } = useParams();
  if (isNaN(parseInt(eventId))) return (<NotFoundPage />)

  const [ organizerBool, setOrganizerBool ] = useState(false);
  const { name, startDate, endDate, groupId, description, previewImage, Group } = event;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadSingleEvent(eventId));
  }, [ dispatch, eventId ]);

  useEffect(() => {
    if (memberships[ groupId ]) {
      return setOrganizerBool(memberships[ groupId ].status === 'co-host');
    }
    else return setOrganizerBool(false);
  }, [ dispatch, memberships, event, groupId ]);

  const history = useHistory();
  const groupType = Group ? (Group.private === true ? 'Public group' : 'Private group') : null;
  const groupName = Group ? Group.name : null;
  const startDateSlice = startDate ? convertDate(startDate) : null;
  const endDateSlice = endDate ? convertDate(endDate) : null;

  const handleDelete = (e) => {
    e.preventDefault();
    const data = dispatch(thunkDeleteEvent({ eventId }))
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
                heading={`${startDateSlice}`}
                subHeading={`${endDateSlice}`}
              />
            </section>
          </div>
        </div>
      </div>
      <div></div>
      <div className="event-page-footer">
        <div className="event-page-footer-buffer">
          <div className="event-page-footer-container">
            <div className="event-page-footertext">
              {`${startDateSlice}`}
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
      <BottomNav pageType={'events'}>
        <Link to={`/events`} className="page-return">
          <h3>
            <i class="fa-solid fa-angle-left" /> Back to More Events
          </h3>
        </Link>
        <Link to={`/groups/${groupId}`} className='page-return'>
          <h3>Visit This Group <i class="fa-solid fa-angle-right"></i>
          </h3>
        </Link>
      </BottomNav>
    </>
  )
}

export default SingleEventPage;
