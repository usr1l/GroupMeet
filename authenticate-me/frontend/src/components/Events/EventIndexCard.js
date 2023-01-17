import React from "react";
import { NavLink } from "react-router-dom";
import './EventsPage.css';


function EventIndexCard({ event }) {
  const { id, name, type, Venue } = event;

  return (
    <li key={`${name}-${id}`}>
      <NavLink to={`/events/${id}`} className='event-index-cards-click'>
        <ul>
          <li>{name}</li>
          <li>Type: {type}</li>
          <li>Location: {`${Venue.city}, ${Venue.state}`}</li>
        </ul>
      </NavLink>
    </li>
  )

};


export default EventIndexCard;
