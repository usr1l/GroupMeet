import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { thunkLoadEvents, thunkUpdateEvent, thunkLoadSingleEvent } from "../../store/events";
import getCurrTime from "../HelperFns/GetCurrTime";


const EditEventPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadSingleEvent(eventId))
      .then((data) => {
        const { name, type, startDate, endDate, description, price, capacity } = data.Event;
        setName(name);
        setDescription(description);
        setType(type);
        setStartDate(startDate.slice(0, 10));
        setStartTime(startDate.slice(11));
        setEndDate(endDate.slice(0, 10));
        setEndTime(endDate.slice(11));
        setPrice(price);
        setCapacity(capacity);
      });
  }, []);

  const history = useHistory();

  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ type, setType ] = useState('');
  const [ startDate, setStartDate ] = useState('');
  const [ startTime, setStartTime ] = useState('');
  const [ endDate, setEndDate ] = useState('');
  const [ endTime, setEndTime ] = useState('');
  const [ capacity, setCapacity ] = useState(null);
  const [ price, setPrice ] = useState(null);
  const [ errors, setErrors ] = useState([]);


  const validate = () => {
    const validationErrors = [];

    const { currDateTime } = getCurrTime();
    if (!name || (name.length < 5)) validationErrors.push('Please provide a name at least 5 characters long');
    if ((!description)) validationErrors.push('A description is required');
    if (!type) validationErrors.push('Please specify if event is \'In person\' or \'Online\'');

    if (`${startDate} ${startTime}` <= currDateTime) validationErrors.push('Please provide a start date, must be in the future');
    if (`${endDate} ${endTime}` < startDate) validationErrors.push('Please provide an end date, must be after start date');
    if (!type) validationErrors.push('Please specify the type');

    if ((price && parseFloat(price) < 0) || (!Number.isInteger(100 * parseFloat(price)))) validationErrors.push('Invalid Price');
    if (capacity && parseFloat(capacity) <= 0) validationErrors.push('Invalid Capacity');


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
      price: price ? parseFloat(price) : null,
      capacity: capacity ? parseFloat(capacity) : null
    };

    const response = await dispatch(thunkUpdateEvent(eventInfo, eventId));

    if (response.ok) {
      await dispatch(thunkLoadEvents());
      history.push(`/events/${eventId}`);
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
