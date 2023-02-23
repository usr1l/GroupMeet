import React from "react";
import { NavLink, Link, Route } from "react-router-dom";
import SingleEventPage from "./ShowSingleEvent";
// import './EventsPage.css';


function EventIndexCard({ event }) {
  const { id, name, type, previewImage, startDate, numAttending } = event;

  return (
    <li key={`${name}-${id}`} className='event-index-card'>
      <Link to={`/events/${id}`} className='event-index-cards-click'>
        <img src={previewImage} alt='preview' className='event-index-card-component event-index-image' />
        <ul className='event-index-card-component'>
          <h1 className='event-index-card-item'>{name}</h1>
          <li className='event-index-card-item'>{startDate}</li>
          <li className='event-index-card-item'>Type: {type}</li>
          <li className='event-index-card-item' id='num-attending'>{numAttending} Attendees</li>
        </ul>
      </Link>
    </li>
  )

};


export default EventIndexCard;
