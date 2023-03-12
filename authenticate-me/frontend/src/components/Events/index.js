import React from "react";
import { useSelector } from "react-redux";
import FeaturesBar from "../FeaturesBar";
import EventsList from "./EventsList";
import './EventsPage.css';

const AllEventsPage = () => {

  const eventsObj = useSelector(state => state.events.events);
  const eventsArr = Object.values(eventsObj);

  // sort order by order, but past events go last
  const events = eventsArr.sort((a, b) => {
    const currDate = new Date();
    const startA = new Date(a.startDate);
    if (startA < currDate) return b.startDate - a.startDate;
    if (startA > currDate) return a.startDate - b.startDate;
  });

  return (
    <div className="events-index-page">
      <FeaturesBar />
      <EventsList events={events} />
    </div >
  );
};

export default AllEventsPage;
