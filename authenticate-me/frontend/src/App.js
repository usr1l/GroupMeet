// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllGroupsPage from './components/Groups';
import AllEventsPage from './components/Events';
import NotificationPage from "./components/Notifications";
import NotFoundPage from "./components/NotFoundPage";
import HomePage from "./components/HomePage";
import MessagesPage from "./components/Messages";
import CreateEventForm from './components/Events/CreateEventForm';
// import MembershipsPage from "./components/MembershipsPage";
import CreateGroupForm from './components/Groups/CreateGroupForm';
import EditEventPage from "./components/Events/EditEvent";
import EditGroupPage from "./components/Groups/EditGroup";
import SingleEventPage from "./components/Events/ShowSingleEvent";
import SingleGroupPage from "./components/Groups/ShowSingleGroup";
import { thunkLoadEvents } from "./store/events";
import { thunkLoadGroups } from "./store/groups";
import SplashPage from "./components/SplashPage";
// import BottomNav from "./components/BottomNav";

function App() {

  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(thunkLoadEvents());
    dispatch(thunkLoadGroups());
    dispatch(sessionActions.thunkRestoreUser())
      .then(() => setIsLoaded(true));
  }, [ dispatch ]);

  useEffect(() => {
    if (sessionUser) dispatch(sessionActions.thunkLoadUserMemberships());
  }, [ sessionUser ]);

  const [ isLoaded, setIsLoaded ] = useState(false);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <>
          <Switch>
            <Route exact path='/' component={sessionUser ? HomePage : SplashPage} />
            <Route exact path='/events' component={AllEventsPage} />
            <Route exact path='/groups' component={AllGroupsPage} />
            {sessionUser && (
              <Route exact path='/messages' component={MessagesPage} />
            )}
            {sessionUser && (
              <Route exact path='/notifications' component={NotificationPage} />
            )}
            {sessionUser && (
              <Route path='/groups/:groupId/events/new' component={CreateEventForm} />
            )}
            {sessionUser && (
              <Route path='/groups/:groupId/members' component={SingleGroupPage} />
            )}
            {sessionUser && (
              <Route path='/groups/:groupId/events' component={SingleGroupPage} />
            )}
            {sessionUser && (
              <Route path='/events/:eventId/edit' component={EditEventPage} />
            )}
            {sessionUser && (
              <Route path='/groups/:groupId/edit' component={EditGroupPage} />
            )}
            {sessionUser && (
              <Route path='/groups/new' component={CreateGroupForm} />
            )}
            <Route path='/events/:eventId' component={SingleEventPage} />
            <Route path='/groups/:groupId' component={SingleGroupPage} />
            <Route exact path='/not-found' component={NotFoundPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </>
      )}
      {/* <BottomNav ></BottomNav> */}
    </>
  );
}

export default App;
