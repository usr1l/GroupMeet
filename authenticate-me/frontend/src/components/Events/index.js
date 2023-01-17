import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadEvents } from "../../store/events";
import EventIndexCard from "./EventIndexCard";
import './EventsPage.css';

const AllEventsPage = () => {
  const dispatch = useDispatch();

  const eventsObj = useSelector(state => state.events.events);
  const events = Object.values(eventsObj);

  useEffect(() => {
    dispatch(thunkLoadEvents());
  }, [ dispatch ]);

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
