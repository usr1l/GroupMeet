import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateEvent, thunkLoadEvents } from "../../store/events";
import { useHistory, useParams } from "react-router-dom";
import getCurrTime from "../HelperFns/GetCurrTime";

const CreateEventForm = (event) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { groupId } = useParams();

  const [ currDateTime, currTime, currDate ] = getCurrTime();


  const [ name, setName ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ type, setType ] = useState("");
  const [ startDate, setStartDate ] = useState(currDate);
  const [ startTime, setStartTime ] = useState(currTime);
  const [ endDate, setEndDate ] = useState(currDate);
  const [ endTime, setEndTime ] = useState(currTime);
  const [ capacity, setCapacity ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ previewImage, setPreviewImage ] = useState('')
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
      price: parseFloat(price),
      capacity,
      startDate: `${startDate} ${startTime}`,
      endDate: `${endDate} ${endTime}`,
      previewImage,
      groupId,
      venueId: null
    };

    const data = await dispatch(thunkCreateEvent(eventInfo));

    if (data.statusCode === 409) {
      setErrors([ data.message ]);
      return errors;
    };

    await thunkLoadEvents();

    history.push(`/events/${data.id}`);
    return;
  };


  return (
    <div>
      <h2>CREATE AN EVENT</h2>
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
        <div className="group-form-element">
          <input
            id="eventName"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder='Name (min 5 characters)'
          />
        </div>
        <div className="group-form-element">
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
        <div className="group-form-element">
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            name="price"
            value={price}
            placeholder='0.00'
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="group-form-element">
          <label htmlFor="capacity">Capacity: </label>
          <input
            type="number"
            name="capactiy"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)} />
        </div>
        <div className="group-form-element">
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
        <div className="group-form-element">
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
        <div className="group-form-element">
          <textarea
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder='What is your event about'
          />
        </div>
        <div className="group-form-element">
          <label htmlFor="event-profile-img">Event Image: </label>
          <input
            name="event-profile-img"
            type='url'
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
        </div>
        <button >Submit</button>
      </form>
    </div>
  );
}

export default CreateEventForm;
