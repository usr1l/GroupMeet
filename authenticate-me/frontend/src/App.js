// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Groups from './store/groups';
import Events from './store/events';
import NotificationPage from "./components/Notifications";
import NotFoundPage from "./components/NotFoundPage";
import HomePage from "./components/HomePage";
import MessagesPage from "./components/Messages";

function App() {
  const dispatch = useDispatch();
  const [ isLoaded, setIsLoaded ] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.thunkRestoreUser()).then(() => setIsLoaded(true));
  }, [ dispatch ]);

  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={'/'}>
            <HomePage />
          </Route>
          <Route path={'/events'}>
            <Events />
          </Route>
          <Route path={'/groups'}>
            <Groups />
          </Route>
          {sessionUser && (
            <>
              <Route path={'/notifications'}>
                <NotificationPage />
              </Route>
              <Route path={'/messages'}>
                <MessagesPage />
              </Route>
            </>
          )}
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
