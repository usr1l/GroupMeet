import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, NavLink, Switch, Route, Redirect } from "react-router-dom";
import {
  thunkDeleteGroup,
  thunkLoadSingleGroup,
  thunkLoadGroupEvents,
  thunkLoadGroupMembers,
  thunkLoadUserStatus,
  thunkRequestMembership,
  thunkDeleteMembership
} from "../../store/groups";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import ImagePreview from "../ImagePreview";
import NotFoundPage from "../NotFoundPage";
import IconLabel from "../IconLabel";
import Button from "../Button";
import EventsList from "../Events/EventsList";
import GroupAboutPage from "./GroupAboutPage";
import MembershipsPage from "../MembershipsPage";
import BottomNav from "../BottomNav";
import "./SingleGroupPage.css";

const SingleGroupPage = ({ groupData }) => {
  const { user } = useSelector(state => state.session);
  if (!user) return <Redirect to='/groups' />

  const group = useSelector(state => state.groups.group);

  const { groupId } = useParams();
  if (isNaN(parseInt(groupId))) return (<NotFoundPage />)
  const dispatch = useDispatch();

  const [ membershipState, setMembershipState ] = useState('...');

  function membershipButtonDisplay(status) {
    switch (status) {
      case 'pending':
        return 'REQUESTED';
      case 'member':
        return 'JOINED';
      case 'co-host':
        return 'CO-HOST';
      default:
        return 'JOIN GROUP';
    };
  };


  useEffect(() => {
    dispatch(thunkLoadSingleGroup(groupId))
      .then(() => dispatch(thunkLoadGroupEvents(groupId)))
      .then(() => dispatch(thunkLoadUserStatus(groupId)))
      .then((res) => setMembershipState(membershipButtonDisplay(res)))
      .then(() => dispatch(thunkLoadGroupMembers(groupId)));
  }, [ dispatch, groupId ]);


  const history = useHistory();

  let {
    name,
    about,
    city,
    state,
    organizerId,
    previewImage,
    numMembers,
    Organizer,
    Events,
    Members
  } = group;

  let events = [];
  let members = [];

  if (Events && Object.values(Events).length) {
    events = Object.values(Events);
  };

  if (Members && Object.values(Members).length) {
    members = Object.values(Members);
  };

  let hostName;
  if (Organizer && Organizer.id) {
    hostName = `${Organizer.firstName} ${Organizer.lastName}`;
  };

  const isPrivate = group.private === true ? 'Private' : 'Public';
  const userId = user.id;

  const organizerFn = () => {
    if (userId) {
      return organizerId === userId;
    };
    return false;
  };

  const organizerBool = organizerFn();


  // need to work on not allowing single host to leave a group
  const handleMemberClick = (e) => {
    e.preventDefault();
    switch (membershipState) {
      case 'JOIN GROUP':
        dispatch(thunkRequestMembership(groupId))
          .then((data) => setMembershipState(membershipButtonDisplay(data)));
        return;
      case 'JOINED':
        dispatch(thunkDeleteMembership({ groupId, memberId: user.id }))
          .then((data) => setMembershipState(membershipButtonDisplay(data)));
        return;
      case 'REQUESTED':
        dispatch(thunkDeleteMembership({ groupId, memberId: user.id }))
          .then((data) => setMembershipState(membershipButtonDisplay(data)));
        return;
      case 'CO-HOST':
        window.alert('Hosts are not able to leave their groups.')
        return;
      default:
        return;
    };
  };

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
                <IconLabel iconClass={"fa-solid fa-user-large"} labelText={`Organized by ${hostName}`} />
              </div>
            </div>
            <div id='group-page-description-card-bottom'>
              {/* <i id='group-index-card-component-bottom-share' class="fa-regular fa-share-from-square"></i>
              <div className='group-index-card-item'>{window.location.href}</div> */}
              <Button buttonStyle='btn--delete' buttonSize='btn--large' onClick={handleMemberClick}>{membershipState}</Button>
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

              <div id='group-events-page-wrapper'>
                <div id='group-events-header-wrapper'>
                  <h2>{`Events for this group (${events.length})`}:</h2>
                </div>
                <EventsList events={events} />
              </div>

            </Route>
            <Route path={`/groups/${groupId}/members`}>
              <MembershipsPage members={members} />
            </Route>
            <Route path={`/groups/${groupId}`}>
              <GroupAboutPage about={about} user={user} />
            </Route>
          </Switch>
        </div>
      </div>
      <BottomNav>
        <div className="groups-bottom-nav-wrapper">
          <Link to={`/groups`} className="page-return">
            <h3>
              <i class="fa-solid fa-angle-left" /> Back to More Groups
            </h3>
          </Link>
          {organizerBool && (
            <Link to={`/groups/${groupId}/events/new`} className='page-return'>
              <h3>Create An Event
                <i class="fa-solid fa-angle-right"></i>
              </h3>
            </Link>
          )}
        </div>
      </BottomNav>
    </>
  )
}



export default SingleGroupPage;
