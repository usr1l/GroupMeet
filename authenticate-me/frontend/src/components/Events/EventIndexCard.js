import React from "react";
import { Link } from "react-router-dom";
import ImagePreview from "../ImagePreview";
import convertDate from "../HelperFns/ConvertDate";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { thunkLoadSingleEvent } from "../../store/events";
import './EventsPage.css';


function EventIndexCard({ event }) {
  const { id, name, type, previewImage, startDate, numAttending, Group } = event;
  const newDate = startDate ? convertDate(startDate) : null;
  const { user } = useSelector(state => state.session);
  const state = Group ? Group.state : null;
  const city = Group ? Group.city : null;
  const dispatch = useDispatch();

  const loginAlert = (e) => {
    if (!user) {
      e.preventDefault();
      return alert('Please login to see more.');
    };

    dispatch(thunkLoadSingleEvent(id));

    return;
  };

  return (
    <Link to={`/events/${id}`} onClick={loginAlert}>
      <div className='event-index-cards-click'>
        <ImagePreview imgSrc={previewImage} imgWrapperStyle='event-index-card-image-container' imgClassName='event-index-card-image' />
        <div key={`${name}-${id}`} className='event-index-card'>
          <ul className='event-index-card-component'>
            <li className='event-index-card-item' id='event-index-card-item-startDate'>{`${newDate}`}</li>
            <h2 className='event-index-card-item'>{name}</h2>
            <li className='event-index-card-item'>{state}, {city}</li>
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
