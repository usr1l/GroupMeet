import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Link, Redirect } from "react-router-dom";
import { thunkUpdateEvent, thunkLoadSingleEvent } from "../../store/events";
import getCurrTime from "../HelperFns/GetCurrTime";
import Button from '../Button';
import InputDiv from "../InputDiv";
import ImagePreview from "../ImagePreview";
import BottomNav from "../BottomNav";
import './EventForm.css';
import NotFoundPage from "../NotFoundPage";

const EditEventPage = () => {
  const { eventId } = useParams();
  if (isNaN(parseInt(eventId))) return (<NotFoundPage />);

  const { memberships } = useSelector(state => state.session);
  const { events, isLoading } = useSelector(state => state.events);

  const groupId = events[ eventId ] ? events[ eventId ][ groupId ] : null;
  // const membershipBool = groupId ? memberships[ groupId ] === 'co-host' : false;

  const dispatch = useDispatch();

  const history = useHistory();

  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ type, setType ] = useState('');
  const [ startDate, setStartDate ] = useState('');
  const [ startTime, setStartTime ] = useState('');
  const [ endDate, setEndDate ] = useState('');
  const [ endTime, setEndTime ] = useState('');
  const [ capacity, setCapacity ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ errors, setErrors ] = useState([]);
  const [ previewImage, setPreviewImage ] = useState('');
  const [ disableSubmit, setDisableSubmit ] = useState(true);

  useEffect(() => {
    dispatch(thunkLoadSingleEvent(eventId))
      .then((data) => {
        const { name, type, startDate, endDate, description, price, capacity, previewImage } = data.Event;
        setName(name);
        setDescription(description);
        setType(type);
        setStartDate(startDate.slice(0, 10));
        setStartTime(startDate.slice(11));
        setEndDate(endDate.slice(0, 10));
        setEndTime(endDate.slice(11));
        setPrice(price || 0);
        setCapacity(capacity || '');
        setPreviewImage(previewImage || '');
      });
  }, [ dispatch ]);

  useEffect(() => {
    if (!isLoading && !events[ eventId ]) history.push('/not-found');
  }, [ isLoading, eventId, events ]);

  useEffect(() => {
    if (!isLoading && events[ eventId ]) {
      const { groupId } = events[ eventId ];
      if (!memberships[ groupId ] || memberships[ groupId ].status !== 'co-host') history.push(<div>Not Authorized</div>)
    }
  }, [ isLoading, memberships, groupId ]);

  useEffect(() => {
    if (!name || !description || !type || (!price && price !== 0)) return setDisableSubmit(true);
    else return setDisableSubmit(false);
  }, [ name, description, type, price ]);


  const validate = () => {
    const validationErrors = [];

    const { currDateTime } = getCurrTime();
    if (!name || (name.length < 5)) validationErrors.push('Please provide a name at least 5 characters long');
    if ((!description)) validationErrors.push('A description is required');
    if (!type) validationErrors.push('Please specify if event is \'In person\' or \'Online\'');

    if (`${startDate} ${startTime}` <= currDateTime) validationErrors.push('Please provide a start date, must be in the future');
    if (`${endDate} ${endTime}` <= `${startDate} ${startTime}`) validationErrors.push('Please provide an end date, must be after start date');
    if (!type) validationErrors.push('Please specify the type');

    if ((price && parseFloat(price) < 0) || (!Number.isInteger(100 * parseFloat(price)))) validationErrors.push('Please enter a valid price');
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
      capacity: capacity ? parseFloat(capacity) : null,
      previewImage
    };

    const response = await dispatch(thunkUpdateEvent(eventInfo, eventId));

    if (response.ok) {
      history.push(`/events/${eventId}`);
    };
    return;
  };

  return (
    <>
      <div id='create-event-page-container'>
        <div id='create-event-page'>
          <h2 className='edit-form' id="event-form__title">EDIT AN EVENT</h2>
          <ul id='event-form__error-list'>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          <form id="event-form" onSubmit={onSubmit}>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor='eventName' label='Name: '>
              <input
                id="eventName"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder='Name (min 5 characters)'
              />
            </InputDiv>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor='Type' label='Type: '>
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
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor='price' label='Price: '>
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
                onChange={(e) => setCapacity(e.target.value)}
                placeholder={'Max # of occupants (not required)'}
              />
            </InputDiv>
            <InputDiv divStyle="date-time__block" labelStyle="event-form__label" labelFor='startDate-Time' label='Start Date: '>
              <input
                name='startDate-Time'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                name="startDate-Time"
                type='time'
                step={1}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </InputDiv>
            <InputDiv divStyle="date-time__block" labelStyle="event-form__label" labelFor='endDate-Time' label='End Date: '>
              <input
                name="endDate-Time"
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                name="endDate-Time"
                type='time'
                step={1}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </InputDiv>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor="description" label='Description: '>
              <textarea
                id="description"
                name="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder='What is your event about'
              />
            </InputDiv>
            <InputDiv divStyle="event-form__block" labelStyle="event-form__label" labelFor="event-profile-img" label='Event Image: '>
              <input
                name="event-profile-img"
                type='url'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
              />
            </InputDiv>
            <div id='create-event-button-div'>
              <ImagePreview imgSrc={previewImage}></ImagePreview>
              <Button type='submit' disableButton={disableSubmit} buttonStyle='btn--delete' buttonSize='btn--large'>Update</Button>
            </div>
          </form>
        </div >
      </div >
      <BottomNav>
        <Link to={`/events/${eventId}`} className="page-return">
          <h3>
            <i className="fa-solid fa-angle-left" /> Back to This Event
          </h3>
        </Link>
        <Link to={`/events`} className='page-return'>
          <h3>More Events <i className="fa-solid fa-angle-right"></i>
          </h3>
        </Link>
      </BottomNav>
    </>
  )
}

export default EditEventPage;
