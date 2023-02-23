import React from "react";

import { Route, Switch } from "react-router-dom";
import AllEventsPage from "../Events";
import AllGroupsPage from "../Groups";
import FeaturesBar from "../FeaturesBar";

const HomePage = () => {

  return (
    <div>
      <FeaturesBar />
      <br />
      <Switch>
        <Route exact path={'/'}>
          This Shows Up.
        </Route>
        <Route path='/events' component={AllEventsPage} />
        <Route path='/groups' component={AllGroupsPage} />
      </Switch>
    </div>
  )
};

export default HomePage;
