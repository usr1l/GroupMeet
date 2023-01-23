import React from "react";
import { NavLink } from "react-router-dom";
import './EventsPage.css';


function EventIndexCard({ event }) {
  const { id, name, type, previewImage } = event;

  return (
    <li key={`${name}-${id}`}>
      <NavLink to={`/events/${id}`} className='event-index-cards-click'>
        <img src={previewImage} alt='preview' />
        <ul>
          <h1>{name}</h1>
          <li>Type: {type}</li>
          {/* <li>Location: {`${Venue.city}, ${Venue.state}`}</li> */}
        </ul>
      </NavLink>
    </li>
  )

};


export default EventIndexCard;
