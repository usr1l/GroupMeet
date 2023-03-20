import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, NavLink, Switch, Route } from "react-router-dom";
import { thunkLoadSingleGroup, thunkLoadGroupEvents, thunkLoadGroupMembers, thunkDeleteGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";
import ImagePreview from "../ImagePreview";
import NotFoundPage from "../NotFoundPage";
import IconLabel from "../IconLabel";
import Button from "../Button";
import EventsList from "../Events/EventsList";
import GroupAboutPage from "./GroupAboutPage";
import MembershipsPage from "../MembershipsPage";
import BottomNav from "../BottomNav";
import GroupImagesPage from "./GroupImagesPage";
import { thunkSessionDeleteMembership, thunkSessionRequestMembership } from "../../store/session";
import "./SingleGroupPage.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const SingleGroupPage = ({ groupData }) => {
  const { groupId } = useParams();
  if (isNaN(parseInt(groupId))) return (<NotFoundPage />);

  const history = useHistory();

  const { user } = useSelector(state => state.session);
  const { groups, group, isLoading } = useSelector(state => state.groups);
  const { memberships } = useSelector(state => state.session);

  const [ membershipState, setMembershipState ] = useState('...');
  const [ organizerBool, setOrganizerBool ] = useState(false);
  const [ isLoaded, setIsLoaded ] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && !groups[ groupId ]) history.push('/not-found');
  }, [ isLoading ])

  useEffect(() => {
    dispatch(thunkLoadSingleGroup(groupId))
      .then((res) => {
        if (res.id) {
          dispatch(thunkLoadGroupEvents(groupId));
          dispatch(thunkLoadGroupMembers(groupId));
          setIsLoaded(true);
        };
      });
  }, [ dispatch ]);

  useEffect(() => {
    if (memberships[ groupId ]) setMembershipState(membershipButtonDisplay(memberships[ groupId ].status));
    else setMembershipState('Join Group');
  }, [ memberships, groupId ]);

  useEffect(() => {
    if (membershipState === 'Co-Host') setOrganizerBool(true);
    else setOrganizerBool(false);
  }, [ membershipState ]);

  const {
    name,
    about,
    city,
    state,
    previewImage,
    numMembers,
    Organizer,
    Events,
    Members,
    GroupImages
  } = group;

  const events = Events ? Object.values(Events) : [];
  const membersArr = Members ? Object.values(Members) : [];
  const members = membersArr.sort((a, b) =>
    a.memberStatus === b.memberStatus ?
      (a.lastName === b.lastName ? b.firstName.localeCompare(a.firstName)
        : b.lastName.localeCompare(a.lastName))
      : a.memberStatus.localeCompare(b.memberStatus
      ));
  const images = GroupImages ? Object.values(GroupImages) : [];

  const hostName = Organizer ? `${Organizer.firstName} ${Organizer.lastName}` : null;
  const isPrivate = group.private === true ? 'Private' : 'Public';

  function membershipButtonDisplay(status) {
    let response;
    switch (status) {
      case 'pending':
        response = 'Requested';
        break;
      case 'member':
        response = 'Member';
        break;
      case 'co-host':
        response = 'Co-Host';
        break;
      default:
        response = 'Join Group';
        break;
    };
    return response;
  };

  // need to work on not allowing single host to leave a group
  const handleMemberClick = (e) => {
    e.preventDefault();
    switch (membershipState) {
      case 'Join Group':
        dispatch(thunkSessionRequestMembership(groupId));
        break;
      case 'Member':
        dispatch(thunkSessionDeleteMembership({ groupId, memberId: user.id }));
        break;
      case 'Requested':
        dispatch(thunkSessionDeleteMembership({ groupId, memberId: user.id }));
        break;
      case 'Co-Host':
        window.alert('Hosts are not able to leave their groups.');
        break;
      default:
        break;
    };
    return;
  };

  return (
    <>
      {isLoaded && (

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
                  {user && (
                    <Button buttonStyle='btn--delete' buttonSize='btn--large' onClick={handleMemberClick}>{membershipState}</Button>
                  )}
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
                  {user && (
                    <NavLink to={`/groups/${groupId}/members`} className="single-group-page-navbar-item" activeClassName='group-navbar-navlink-active'>
                      Members
                    </NavLink>
                  )}
                  {/* {user && (
                    <NavLink to={`/groups/${groupId}/images`} className="single-group-page-navbar-item" activeClassName='group-navbar-navlink-active'>
                      Photos
                    </NavLink>
                  )} */}
                </div>
              </div>
              <div className="single-group-page-navbar-functions">
                {organizerBool && (
                  <>
                    <Link to={`/groups/${groupId}/edit`}>
                      <Button buttonStyle='btn--big' buttonSize='btn--large' onClick={(e) => e.preventDefault}>Edit Details</Button>
                    </Link>
                    <OpenModalMenuItem
                      itemText='Delete Group'
                      buttonStyle='btn--delete'
                      buttonSize='btn--large'
                      modalComponent={<ConfirmDeleteModal directTo={'/groups'} groupId={groupId} deleteFn={thunkDeleteGroup} />}
                    />
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
                      <h2>{`Events for this group (${events.length})`}</h2>
                    </div>
                    <EventsList events={events} />
                  </div>
                </Route>
                {user && (
                  <Route path={`/groups/${groupId}/members`}>
                    <MembershipsPage members={members} organizerBool={organizerBool} groupId={groupId} />
                  </Route>
                )}
                {user && (
                  <Route path={`/groups/${groupId}/images`}>
                    <GroupImagesPage images={images} />
                  </Route>
                )}
                <Route path={`/groups/${groupId}`}>
                  <GroupAboutPage about={about} hostName={hostName} status={membershipState} />
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
      )}
    </>
  )
};



export default SingleGroupPage;
