import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { thunkLoadEvents, thunkUpdateEvent } from "../../store/events";
import getCurrTime from "../HelperFns/GetCurrTime";


const EditEventPage = () => {
  const event = useSelector(state => state.events.event);
  const history = useHistory();
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const [ currDateTime, currTime, currDate ] = getCurrTime();

  const [ name, setName ] = useState(event.name);
  const [ description, setDescription ] = useState(event.description);
  const [ type, setType ] = useState(event.type);
  const [ startDate, setStartDate ] = useState(currDate);
  const [ startTime, setStartTime ] = useState(currTime);
  const [ endDate, setEndDate ] = useState(currDate);
  const [ endTime, setEndTime ] = useState(currTime);
  const [ capacity, setCapacity ] = useState(event.capacity);
  const [ price, setPrice ] = useState(event.price);
  const [ errors, setErrors ] = useState([]);


  const validate = () => {
    const validationErrors = [];

    const [ currDateTime ] = getCurrTime();
    if (!name || (name.length < 5)) validationErrors.push('Please provide a name at least 5 characters long');
    if ((!description)) validationErrors.push('A description is required');
    if (!type) validationErrors.push('Please specify if event is \'In person\' or \'Online\'');

    if (`${startDate} ${startTime}` <= currDateTime) validationErrors.push('Please provide a start date, must be in the future');
    if (`${endDate} ${endTime}` < startDate) validationErrors.push('Please provide an end date, must be after start date');
    if (!type) validationErrors.push('Please specify the type');
    if (price && parseFloat(price) < 0) validationErrors.push('Invalid Price');
    if (capacity && capacity < 0) validationErrors.push('Invalid Capacity');


    return validationErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (validationErrors.length > 0) return setErrors(validationErrors);

    const eventInfo = {
      name,
      description,
      type,
      startDate: `${startDate} ${startTime}`,
      endDate: `${endDate} ${endTime}`,
      price,
      capacity
    };

    const response = await dispatch(thunkUpdateEvent(eventInfo, eventId));

    if (response.ok) {
      await dispatch(thunkLoadEvents());
      history.push(`/events/${response.id}`);
    };
    return;
  };

  return (
    <>
      <div>
        <h2>EDIT AN EVENT</h2>
        {!!errors.length && (
          <div>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div>
            <input
              id="eventName"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Name (min 5 characters)'
            />
          </div>
          <div>
            <label htmlFor="type">Type: </label>
            <select
              name="Type"
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value="" disabled>
                select:
              </option>
              <option value='In person'>In person</option>
              <option value='Online'>Online</option>
            </select>
          </div>
          <div>
            <label htmlFor="price">Price: </label>
            <input
              type="number"
              name="price"
              value={price}
              placeholder='0.00'
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="capacity">Capacity: </label>
            <input
              type="number"
              name="capactiy"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)} />
          </div>
          <div>
            <label htmlFor="startDate-Time">Start Date: </label>
            <input
              name='startDate-Time'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              name="startDate-Time"
              type='time'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value + ':00')}
            />
          </div>
          <div>
            <label htmlFor="endDate-Time">End Date: </label>
            <input
              name="endDate-Time"
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              name="endDate-Time"
              type='time'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value + ':00')}
            />
          </div>
          <div>
            <textarea
              id="description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder='What is your event about'
            />
          </div>
          <button>Submit</button>
        </form>
      </div>
    </>
  )
}

export default EditEventPage;
