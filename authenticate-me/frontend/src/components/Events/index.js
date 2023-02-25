import React from "react";
import { useSelector } from "react-redux";
import FeaturesBar from "../FeaturesBar";
import EventsList from "./EventsList";
import './EventsPage.css';

const AllEventsPage = () => {

  const eventsObj = useSelector(state => state.events.events);
  const events = Object.values(eventsObj);

  return (
    <div className="events-index-page">
      <FeaturesBar />
      <EventsList events={events} />
    </div >
  );
};

export default AllEventsPage;
