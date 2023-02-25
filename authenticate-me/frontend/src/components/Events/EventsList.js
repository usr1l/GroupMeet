import React from "react";
import EventIndexCard from "./EventIndexCard";
import './EventsPage.css';


const EventsList = ({
  events
}) => {
  return (
    <div className="events-index-page-wrapper">
      <div className="events-index-container">
        {
          events.map((event) => {
            return (
              <EventIndexCard event={event} />
            )
          })
        }
      </div>
    </div>
  )
}

export default EventsList;
