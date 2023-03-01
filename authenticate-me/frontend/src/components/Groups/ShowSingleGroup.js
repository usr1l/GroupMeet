import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, NavLink, Switch, Route } from "react-router-dom";
import { thunkDeleteGroup, thunkLoadSingleGroup, thunkLoadGroupEvents, thunkLoadGroupMembers } from "../../store/groups";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import ImagePreview from "../ImagePreview";
import NotFoundPage from "../NotFoundPage";
import IconLabel from "../IconLabel";
import Button from "../Button";
import EventsList from "../Events/EventsList";
import GroupAboutPage from "./GroupAboutPage";
import "./SingleGroupPage.css";
import MembershipsPage from "../MembershipsPage";

const SingleGroupPage = ({ groupData }) => {

  const { groupId } = useParams();
  if (isNaN(parseInt(groupId))) return (<NotFoundPage />)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadSingleGroup(groupId));
    dispatch(thunkLoadGroupEvents(groupId));
    dispatch(thunkLoadGroupMembers(groupId));
  }, [ dispatch, groupId ]);

  const { user } = useSelector(state => state.session);
  const group = useSelector(state => state.groups.group);


  if (Object.keys(group).length < 6) return (<div>Loading . . .</div>);

  const history = useHistory();

  let { name, about, city, state, organizerId, previewImage, numMembers, Organizer, Events, Members } = group;
  let events = [];

  if (Events && Object.values(Events).length) {
    events = Object.values(Events);
  };

  const isPrivate = group.private === true ? 'Private' : 'Public';

  const organizerFn = () => {
    if (user) {
      return organizerId === user.id
    };
    return false;
  };

  const organizerBool = organizerFn(user);

  const handleDelete = async (e) => {
    e.preventDefault();
    const data = await dispatch(thunkDeleteGroup({ groupId }));

    if (data.ok === true) {
      history.push(`/groups`);
    };

    if (data.ok === false) {
      errorPageHandler(data);
    };

    return;
  };

  return (
    <>
      <div className="group-header-background">
        <div className="group-header">
          <ImagePreview imgWrapperStyle="group-page-header-image-container" imgClassName='group-page-header-image' imgSrc={previewImage}></ImagePreview>
          <div className="group-page-description-card-container">
            <div className="group-page-description-card">
              <h2 id="single-group-page-name">{name}</h2>
              <div>
                <IconLabel iconClass={"fa-solid fa-location-dot"} labelText={`${city}, ${state}`} />
                <IconLabel iconClass={"fa-solid fa-user-group"} labelText={`${numMembers} Members • ${isPrivate} Group`} />
                <IconLabel iconClass={"fa-solid fa-user-large"} labelText={`Organized by ${Organizer.firstName} ${Organizer.lastName}`} />
              </div>
            </div>
            <div id='group-page-description-card-bottom'>
              <i id='group-index-card-component-bottom-share' class="fa-regular fa-share-from-square"></i>
              <div className='group-index-card-item'>{window.location.href}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="single-group-page-navbar-background">
        <div className="single-group-page-navbar-container">
          <div className="single-group-page-navbar-wrapper">
            <div className="single-group-page-navbar">
              <NavLink to={`/groups/${groupId}`} className="single-group-page-navbar-item" activeClassName='group-navbar-navlink-active'>
                About
              </NavLink>
              <NavLink to={`/groups/${groupId}/events`} className="single-group-page-navbar-item" activeClassName='group-navbar-navlink-active'>
                Events
              </NavLink>
              <NavLink to={`/groups/${groupId}/members`} className="single-group-page-navbar-item" activeClassName='group-navbar-navlink-active'>
                Members
              </NavLink>
            </div>
          </div>
          <div className="single-group-page-navbar-functions">
            {organizerBool && (
              <>
                <Link to={`/groups/${groupId}/edit`}>
                  <Button buttonStyle='btn--big' buttonSize='btn--large' onClick={(e) => e.preventDefault}>Edit</Button>
                </Link>
                <Button buttonStyle='btn--delete' buttonSize='btn--large' onClick={handleDelete}>Delete</Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="group-property-page-container">
        <div className="group-property-page-wrapper">
          <Switch>
            <Route exact path={`/groups/${groupId}/events`}>
              <>
                <EventsList events={events} />
                {organizerBool && (
                  <section className="group-events-page-sticky-div">
                    <div className="group-events-page-icon-card-section">
                      <Link to={`/groups/${groupId}/events/new`}>
                        <Button onClick={(e) => e.preventDefault} buttonStyle='btn--delete'>Create Event</Button>
                      </Link>
                    </div>
                  </section>
                )}
              </>
            </Route>
            <Route path={`/groups/${groupId}/members`}>
              <MembershipsPage members={Members} />
            </Route>
            <Route path={`/groups/${groupId}`}>
              <GroupAboutPage about={about} user={user} />
            </Route>
          </Switch>
        </div>
      </div>
    </>
  )
}



export default SingleGroupPage;
