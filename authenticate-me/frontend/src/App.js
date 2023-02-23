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
// import FeaturesBar from "./components/FeaturesBar";
import CreateEventForm from './components/Events/CreateEventForm';
import CreateGroupForm from './components/Groups/CreateGroupForm';
import EditEventPage from "./components/Events/EditEvent";
import EditGroupPage from "./components/Groups/EditGroup";
import SingleEventPage from "./components/Events/ShowSingleEvent";
import SingleGroupPage from "./components/Groups/ShowSingleGroup";
import { thunkLoadEvents } from "./store/events";
import { thunkLoadGroups } from "./store/groups";
import SplashPage from "./components/SplashPage";
// import FeaturesBar from "./components/FeaturesBar";


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadEvents());
    dispatch(thunkLoadGroups());
    dispatch(sessionActions.thunkRestoreUser()).then(() => setIsLoaded(true));
  }, [ dispatch ]);

  const [ isLoaded, setIsLoaded ] = useState(false);

  const sessionUser = useSelector(state => state.session.user);

  return (
    <div>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/' component={sessionUser ? HomePage : SplashPage} />
          <Route path='/groups/new' component={CreateGroupForm} />
          <Route path='/messages' component={MessagesPage} />
          <Route path='/notifications' component={NotificationPage} />
          {/* <Route path='/groups/:groupId/events/new' component={CreateEventForm} />
            <Route path='/events/:eventId/edit' component={EditEventPage} />
            <Route path='/groups/:groupId/edit' component={EditGroupPage} /> */}
          {/* <Route path='/events/:eventId' component={SingleEventPage} /> */}
          {/* <Route path='/groups/:groupId' component={SingleGroupPage} /> */}
          {/* <Route component={NotFoundPage} /> */}
        </Switch>
      )}
      {/* <footer></footer> */}
    </div>
  );
}

export default App;
