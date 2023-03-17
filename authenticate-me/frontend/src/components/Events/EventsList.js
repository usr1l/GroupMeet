import React from "react";
import EventIndexCard from "./EventIndexCard";
import './EventsPage.css';


const EventsList = ({
  events
}) => {
  return (
    <div className="events-index-page-wrapper">
      <div className="events-index-container">
        {events.map((event) => (<EventIndexCard key={`${event.name}-${event.id}`} event={event} />))}
      </div>
    </div>
  )
}

export default EventsList;
