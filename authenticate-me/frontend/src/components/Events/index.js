import React from "react";
import { useSelector } from "react-redux";
import EventIndexCard from "./EventIndexCard";
import FeaturesBar from "../FeaturesBar";
import './EventsPage.css';

const AllEventsPage = () => {

  const eventsObj = useSelector(state => state.events.events);
  const events = Object.values(eventsObj);

  return (
    <div className="events-index-page">
      <FeaturesBar />
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
    </div >
  );
};

export default AllEventsPage;
