import React from "react";
import { Link } from "react-router-dom";
import ImagePreview from "../ImagePreview";
import convertDate from "../HelperFns/ConvertDate";
import './EventsPage.css';


function EventIndexCard({ event }) {
  const { id, name, type, previewImage, startDate, numAttending, Group } = event;
  const newDate = startDate ? convertDate(startDate) : null;
  const state = Group ? Group.state : null;
  const city = Group ? Group.city : null;

  return (
    <Link to={`/events/${id}`}>
      <div className='event-index-cards-click'>
        <ImagePreview imgSrc={previewImage} imgWrapperStyle='event-index-card-image-container' imgClassName='event-index-card-image' />
        <div className='event-index-card'>
          <ul className='event-index-card-component'>
            <li key={`event-index-card-${id}`} className='event-index-card-item' id='event-index-card-item-startDate'>{`${newDate}`}</li>
            <h2 className='event-index-card-item'>{name}</h2>
            <li key={`event-index-card--${id}${state}-${city}`} className='event-index-card-item'>{state}, {city}</li>
          </ul>
          <div className='event-index-card-component'>
            <div className='event-index-card-item' id='num-attending'>{numAttending} Attendees</div>
            <div className='event-index-card-item'>
              <div>{type}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
};


export default EventIndexCard;
