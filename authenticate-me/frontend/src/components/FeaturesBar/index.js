import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";


const FeaturesBar = () => {
  const [ selectedFeaturesBarItem, setSelectedFeaturesBarItem ] = useState('fb-events-button');

  function handleClick(e) {
    const currId = e.target.id;
    if (e.target.id !== selectedFeaturesBarItem)
      setSelectedFeaturesBarItem(`${currId}`)
  };

  useEffect(() => {

  }, [ selectedFeaturesBarItem ])

  return (
    <div className='features-bar'>
      <NavLink to='/events'>
        <button
          className="features-bar-button"
          id='fb-events-button'
          onClick={handleClick}>
          Events
        </button>
      </NavLink>
      <NavLink to='/groups'>
        <button
          className="features-bar-button"
          id='fb-groups-button'
          onClick={handleClick}>
          Groups
        </button>
      </NavLink>
    </div>
  )
};

export default FeaturesBar;
