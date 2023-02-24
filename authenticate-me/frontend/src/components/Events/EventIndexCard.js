import React from "react";
import { Link } from "react-router-dom";
import ImagePreview from "../ImagePreview";
import './EventsPage.css';


function EventIndexCard({ event }) {
  const { id, name, type, previewImage, startDate, numAttending, Group } = event;

  return (
    <Link to={`/events/${id}`}>
      <div className='event-index-cards-click'>
        <ImagePreview imgSrc={previewImage} imgWrapperStyle='event-index-card-image-container' imgClassName='event-index-card-image' />
        <div key={`${name}-${id}`} className='event-index-card'>
          <ul className='event-index-card-component'>
            <li className='event-index-card-item' id='event-index-card-item-startDate'>{startDate}</li>
            <h2 className='event-index-card-item'>{name}</h2>
            <li className='event-index-card-item'>{Group.state}, {Group.city}</li>
          </ul>
          <div className='event-index-card-component'>
            <div className='event-index-card-item' id='num-attending'>
              {numAttending} Attendees
            </div>
            <div className='event-index-card-item'>
              <div>
                {type}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )

};


export default EventIndexCard;
