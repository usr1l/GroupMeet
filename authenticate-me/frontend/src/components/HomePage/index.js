import React from "react";
// import { useSelector } from "react-redux";
import { Route, Switch, NavLink } from "react-router-dom";
import AllEventsPage from "../Events";
import AllGroupsPage from "../Groups";
import FeaturesBar from "../FeaturesBar";

const HomePage = () => {
  // const sessionUser = useSelector(state => state.session.user);

  return (
    <div>
      {/* <FeaturesBar /> */}
      <NavLink to='/events'>
        Events
      </NavLink>
      <NavLink to='/groups'>
        Groups
      </NavLink>
      <br />
      <Switch>
        <Route path='/events'>
          (
          <h1>
            Whatever.
          </h1>
          )
        </Route>
        <Route path='/groups' component={AllGroupsPage} />
      </Switch>
    </div>
  )
};

export default HomePage;
