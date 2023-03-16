import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, NavLink, Switch, Route, Redirect } from "react-router-dom";
import { thunkDeleteGroup, thunkLoadSingleGroup, thunkLoadGroupEvents, thunkLoadGroupMembers } from "../../store/groups";
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
import { thunkSessionDeleteMembership, thunkSessionRequestMembership } from "../../store/session";
import "./SingleGroupPage.css";

const SingleGroupPage = ({ groupData }) => {
  const { groupId } = useParams();
  if (isNaN(parseInt(groupId))) return (<NotFoundPage />);

  const { user } = useSelector(state => state.session);
  if (!user) return (<Redirect to='/groups' />);

  const group = useSelector(state => state.groups.group);
  const { groups, isLoading } = useSelector(state => state.groups);
  const { memberships } = useSelector(state => state.session);

  const dispatch = useDispatch();

  const [ membershipState, setMembershipState ] = useState('...');
  const [ organizerBool, setOrganizerBool ] = useState(false);

  function membershipButtonDisplay(status) {
    switch (status) {
      case 'pending':
        return 'Requested';
      case 'member':
        return 'Member';
      case 'co-host':
        return 'Co-Host';
      default:
        return 'Join Group';
    };
  };

  useEffect(() => {
    dispatch(thunkLoadSingleGroup(groupId))
      .then(() => dispatch(thunkLoadGroupEvents(groupId)))
      .then(() => dispatch(thunkLoadGroupMembers(groupId)));
  }, [ dispatch, groupId ]);

  useEffect(() => {
    if (!isLoading && !groups[ groupId ]) history.push(`/not-found`);
  }, [ isLoading, groupId, groups ]);

  useEffect(() => {
    if (memberships[ groupId ]) setMembershipState(membershipButtonDisplay(memberships[ groupId ].status));
    else setMembershipState('Join Group');
  }, [ dispatch, memberships, groupId ]);

  useEffect(() => {
    if (membershipState === 'Co-Host') setOrganizerBool(true);
    else setOrganizerBool(false);
  }, [ dispatch, membershipState ]);

  const history = useHistory();

  const {
    name,
    about,
    city,
    state,
    previewImage,
    numMembers,
    Organizer,
    Events,
    Members
  } = group;

  const events = Events ? Object.values(Events) : [];
  const members = Members ? Object.values(Members) : [];
  const hostName = Organizer ? `${Organizer.firstName} ${Organizer.lastName}` : null;
  const isPrivate = group.private === true ? 'Private' : 'Public';

  // need to work on not allowing single host to leave a group
  const handleMemberClick = (e) => {
    e.preventDefault();
    switch (membershipState) {
      case 'Join Group':
        dispatch(thunkSessionRequestMembership(groupId));
        return;
      case 'Member':
        dispatch(thunkSessionDeleteMembership({ groupId, memberId: user.id }));
        return;
      case 'Requested':
        dispatch(thunkSessionDeleteMembership({ groupId, memberId: user.id }));
        return;
      case 'Co-Host':
        window.alert('Hosts are not able to leave their groups.');
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
              {/* <i id='group-index-card-component-bottom-share' className="fa-regular fa-share-from-square"></i>
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
              <NavLink exact to={`/groups/${groupId}`} className="single-group-page-navbar-item" activeClassName='group-navbar-navlink-active'>
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
              <MembershipsPage members={members} organizerBool={organizerBool} />
            </Route>
            <Route path={`/groups/${groupId}`}>
              <GroupAboutPage about={about} hostName={hostName} />
            </Route>
          </Switch>
        </div>
      </div>
      <BottomNav>
        <Link to={`/groups`} className="page-return">
          <h3>
            <i className="fa-solid fa-angle-left" /> Back to More Groups
          </h3>
        </Link>
        {organizerBool && (
          <Link to={`/groups/${groupId}/events/new`} className='page-return'>
            <h3>Create An Event <i className="fa-solid fa-angle-right"></i>
            </h3>
          </Link>
        )}
      </BottomNav>
    </>
  )
};



export default SingleGroupPage;
