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
import FeaturesBar from "./components/FeaturesBar";
import CreateEventForm from './components/Events/CreateEventForm';
import CreateGroupForm from './components/Groups/CreateGroupForm';
import EditEventPage from "./components/Events/EditEvent";
import EditGroupPage from "./components/Groups/EditGroup";
import SingleEventPage from "./components/Events/ShowSingleEvent";
import SingleGroupPage from "./components/Groups/ShowSingleGroup";
import NotAuthorizedPage from "./components/ErrorPage/NoAuthorization";
import { thunkLoadEvents } from "./store/events";
import { thunkLoadGroups } from "./store/groups";


function App() {
  const dispatch = useDispatch();
  const [ isLoaded, setIsLoaded ] = useState(false);
  useEffect(() => {
    dispatch(thunkLoadGroups());
    dispatch(thunkLoadEvents());
    dispatch(sessionActions.thunkRestoreUser()).then(() => setIsLoaded(true));
  }, [ dispatch ]);

  const sessionUser = useSelector(state => state.session.user)

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <>
          <FeaturesBar />
          <Switch>
            <Route exact path={'/'} component={HomePage} />
            {sessionUser && (
              <Route exact path={'/groups/new'} component={CreateGroupForm} />
            )}
            <Route exact path={'/events'} component={AllEventsPage} />
            <Route exact path={'/groups'} component={AllGroupsPage} />
            <Route exact path={'/messages'} component={MessagesPage} />
            <Route exact path={'/notifications'} component={NotificationPage} />
            {sessionUser && (
              <Route exact path={'/groups/:groupId/events/new'} component={CreateEventForm} />
            )}
            <Route exact path={'/events/:eventId'} component={SingleEventPage} />
            <Route exact path={'/groups/:groupId'} component={SingleGroupPage} />
            {sessionUser && (
              <>
                <Route exact path={'/events/:eventId/edit'} component={EditEventPage} />
                <Route exact path={'/groups/:groupId/edit'} component={EditGroupPage} />
              </>
            )}
            <Route component={NotFoundPage} />
          </Switch>
        </>
      )}
    </>
  );
}

export default App;
