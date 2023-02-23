import React from "react";
import { NavLink } from "react-router-dom";
import './features-bar.css';


const FeaturesBar = () => {

  return (
    <div className='features-bar'>
      <NavLink to='/events'>
        <div className="features-bar-component">
          Events
        </div>
      </NavLink>
      <NavLink to='/groups'>
        <div className="features-bar-component">
          Groups
        </div>
      </NavLink>
    </div>
  )
};

export default FeaturesBar;
