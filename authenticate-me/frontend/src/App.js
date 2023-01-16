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
            <Route path={'/events'}>
              <Route exact patch={'/'} component={AllEventsPage} />
              <Route path={'/new'}></Route>
              <Route path={'/:eventId/edit'}></Route>
              <Route path={'/:eventId/delete'}></Route>
              <Route path={'/:eventId'}></Route>
            </Route>
            <Route path={'/groups'}>
              <Route exact patch={'/'} component={AllGroupsPage} />
              <Route path={'/new'}></Route>
              <Route path={'/:groupId/edit'}></Route>
              {/* <Route path={'/:groupId/delete'}></Route> */}
              <Route path={'/:groupId'}></Route>
            </Route>
            <Route path={'/notifications'} component={NotificationPage} />
            <Route path={'/messages'} component={MessagesPage} />
            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
        </>
      )}
    </>
  );
}

export default App;
