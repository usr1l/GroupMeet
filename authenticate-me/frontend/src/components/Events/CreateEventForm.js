import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateEvent, thunkLoadEvents } from "../../store/events";
import { useHistory, useParams, Link } from "react-router-dom";
import getCurrTime from "../HelperFns/GetCurrTime";
import Button from '../Button';
import InputDiv from "../InputDiv";
import ImagePreview from "../ImagePreview";
import BottomNav from "../BottomNav";
import './EventForm.css';

const CreateEventForm = (event) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { groupId } = useParams();

  const { currTime, currDate } = getCurrTime();

  const [ name, setName ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ type, setType ] = useState("");
  const [ startDate, setStartDate ] = useState(currDate);
  const [ startTime, setStartTime ] = useState(currTime);
  const [ endDate, setEndDate ] = useState(currDate);
  const [ endTime, setEndTime ] = useState(currTime);
  const [ capacity, setCapacity ] = useState(null);
  const [ price, setPrice ] = useState(null);
  const [ previewImage, setPreviewImage ] = useState('')
  const [ errors, setErrors ] = useState([]);
  const [ disableSubmit, setDisableSubmit ] = useState(true);

  useEffect(() => {
    if (!name || !description || !type) return setDisableSubmit(true);
    else return setDisableSubmit(false);
  }, [ name, description, type ]);

  const validate = () => {
    const validationErrors = [];

    const { currDateTime } = getCurrTime();
    if (!name || (name.length < 5)) validationErrors.push('Please provide a name at least 5 characters long');
    if ((!description || description.length < 30)) validationErrors.push('A description is required (30 characters min.');
    if (!type) validationErrors.push('Please specify if event is \'In person\' or \'Online\'');

    if (`${startDate} ${startTime}` <= currDateTime) validationErrors.push('Please provide a start date, must be in the future');
    if (`${endDate} ${endTime}` <= `${startDate} ${startTime}`) validationErrors.push('Please provide an end date, must be after start date');
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
      capacity: parseFloat(capacity),
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
    <>
      <div id='create-event-page-container'>
        <div id='create-event-page'>
          <h2 id="event-form__title">CREATE AN EVENT</h2>
          <ul id='event-form__error-list'>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          <form id="event-form" onSubmit={onSubmit}>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor='eventName' label='What is the name of your event?'>
              <input
                id="eventName"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder='Name (min 5 characters)'
              />
            </InputDiv>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor='Type' label='Is this an in-person or online event?'>
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
            </InputDiv>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor='price' label='What is the price for your event?'>
              <input
                type="number"
                name="price"
                value={price}
                placeholder='0.00'
                onChange={(e) => setPrice(e.target.value)}
              />
            </InputDiv>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor='capacity' label='Capacity: '>
              <input
                type="number"
                name="capactiy"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)} />
            </InputDiv>
            <InputDiv divStyle="date-time__block" labelStyle="event-form__label" labelFor='startDate-Time' label='When does your event start?'>
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
                step={1}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </InputDiv>
            <InputDiv divStyle="date-time__block" labelStyle="event-form__label" labelFor='endDate-Time' label='When does your event end?'>
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
                step={1}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </InputDiv>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor="description" label='Please describe your event'>
              <textarea
                id="description"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder='What is your event about (30 characters min.)'
              />
            </InputDiv>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor="event-profile-img" label='Event Profile Image: '>
              <input
                name="event-profile-img"
                type='url'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
              />
            </InputDiv>
            <div id='create-event-button-div'>
              <ImagePreview imgSrc={previewImage}></ImagePreview>
              <Button type='submit' disableButton={disableSubmit} buttonStyle='btn--delete' buttonSize='btn--large'>Create Event</Button>
            </div>
          </form>
        </div >
      </div>
      <BottomNav>
        <Link to={`/groups/${groupId}`} className="page-return">
          <h3>
            <i class="fa-solid fa-angle-left" /> Back to This Group
          </h3>
        </Link>
      </BottomNav>
    </>
  );
}

export default CreateEventForm;
