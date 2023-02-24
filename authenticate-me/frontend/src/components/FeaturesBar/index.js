import React from "react";
import { NavLink } from "react-router-dom";
import './features-bar.css';


const FeaturesBar = () => {

  return (
    <div className="features-header">
      <div className='features-bar'>
        <NavLink to='/events' className='features-bar-navlink' activeClassName="features-bar-navlink-active events-navlink">
          <div className="features-bar-component">
            Events
          </div>
        </NavLink>
        <NavLink to='/groups' className='features-bar-navlink' activeClassName="features-bar-navlink-active groups-navlink">
          <div className="features-bar-component">
            Groups
          </div>
        </NavLink>
      </div>
    </div>
  )
};

export default FeaturesBar;
