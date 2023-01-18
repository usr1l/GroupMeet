import React from "react";
import { useSelector } from "react-redux";
// import { thunkLoadEvents } from "../../store/events";
import EventIndexCard from "./EventIndexCard";
import './EventsPage.css';

const AllEventsPage = () => {

  const eventsObj = useSelector(state => state.events.events);
  const events = Object.values(eventsObj);

  return (
    <section>
      <ul>
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
