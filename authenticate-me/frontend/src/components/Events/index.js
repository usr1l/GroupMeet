import React from "react";
import { useSelector } from "react-redux";
import EventIndexCard from "./EventIndexCard";
import './EventsPage.css';

const AllEventsPage = () => {

  const eventsObj = useSelector(state => state.events.events);
  const events = Object.values(eventsObj);
  console.log(events)

  return (
    <section className="events-page">
      <ul className="events-index-container">
        {
          events.map((event) => {
            return (
              <EventIndexCard event={event} />
            )
          })
        }
      </ul>
    </section >
  );
};

export default AllEventsPage;
