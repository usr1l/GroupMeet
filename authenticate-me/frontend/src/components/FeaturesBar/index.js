import React from "react";
import { NavLink } from "react-router-dom";
import './features-bar.css';


const FeaturesBar = () => {

  return (
    <div className='features-bar'>
      <NavLink to='/events'>
        Events
      </NavLink>
      <NavLink to='/groups'>
        Groups
      </NavLink>
    </div>
  )
};

export default FeaturesBar;
