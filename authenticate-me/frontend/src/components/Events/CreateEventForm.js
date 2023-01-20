import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateEvent } from "../../store/events";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateEventForm = () => {
  const history = useHistory();
  const sessionUserId = useSelector(state => state.session.user.id);
  const { groupId } = useParams();

  const dispatch = useDispatch();

  const [ name, setName ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ type, setType ] = useState("");
  const [ startDate, setStartDate ] = useState('private');
  const [ startTime, setStartTime ] = useState('private');
  const [ endDate, setEndDate ] = useState("");
  const [ endTime, setEndTime ] = useState("");
  const [ time, setTime ] = useState("");
  const [ capacity, setCapacity ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ errors, setErrors ] = useState([]);


  const validate = () => {
    const validationErrors = [];

    if (!name || (name.length < 5)) validationErrors.push('Please provide a name at least 5 characters long');
    if ((!description)) validationErrors.push('A description is required');
    if (!type) validationErrors.push('Please specify the type');

    if (!startTime || !(startDate)) validationErrors.push('Start date must be in the future');
    if (!endDate || !(endTime)) validationErrors.push('Please specify the type');
    if (!type) validationErrors.push('Please specify the type');


    return validationErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (validationErrors.length > 0) return setErrors(validationErrors);


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
  );
}

export default CreateEventForm;
