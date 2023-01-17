// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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

function App() {
  const dispatch = useDispatch();
  const [ isLoaded, setIsLoaded ] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.thunkRestoreUser()).then(() => setIsLoaded(true));
  }, [ dispatch ]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <>
          <FeaturesBar />
          <Switch>
            <Route exact path={'/'} component={HomePage} />
            <Route exact path={'/events'} component={AllEventsPage} />
            <Route path={'/events/:eventId/edit'} component={EditEventPage} />
            <Route path={'/events/:eventId'} component={SingleEventPage} />
            <Route path={'/events/new'} component={CreateEventForm} />
            <Route exact path={'/groups'} component={AllGroupsPage} />
            <Route path={'/groups/new'} component={CreateGroupForm} />
            <Route path={'/groups/:groupId/edit'} component={EditGroupPage} />
            <Route path={'/groups/:groupId'} component={SingleGroupPage} />
            <Route path={'/notifications'} component={NotificationPage} />
            <Route path={'/messages'} component={MessagesPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </>
      )}
    </>
  );
}

export default App;
