import React from "react";
import { NavLink } from "react-router-dom";
import './EventsPage.css';


function EventIndexCard({ event }) {
  const { id, name, type, previewImage, startDate, numAttending } = event;

  return (
    <li key={`${name}-${id}`} className='event-index-card'>
      <NavLink to={`/events/${id}`} className='event-index-cards-click'>
        <img src={previewImage} alt='preview' className='event-index-card-component event-index-image' />
        <ul className='event-index-card-component'>
          <h1 className='event-index-card-item'>{name}</h1>
          <li className='event-index-card-item'>{startDate}</li>
          <li className='event-index-card-item'>Type: {type}</li>
          {/* <li>Location: {`${Venue.city}, ${Venue.state}`}</li> */}
          {/* <li>{description}</li> */}
          <li className='event-index-card-item' id='num-attending'>{numAttending} Attendees</li>
        </ul>
      </NavLink>
    </li>
  )

};


export default EventIndexCard;
