import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { thunkUpdateEvent, thunkLoadSingleEvent } from "../../store/events";
import getCurrTime from "../HelperFns/GetCurrTime";
import Button from '../Button';
import InputDiv from "../InputDiv";
import ImagePreview from "../ImagePreview";
import BottomNav from "../BottomNav";
import NotFoundPage from "../NotFoundPage";
import './EventForm.css';

const EditEventPage = () => {
  const { eventId } = useParams();
  if (isNaN(parseInt(eventId))) return (<NotFoundPage />);
  const history = useHistory();

  const { memberships, isLoading: userIsLoading } = useSelector(state => state.session);
  const { events, isLoading: eventIsLoading } = useSelector(state => state.events);

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
  const [ eventGroupId, setEventGroupId ] = useState('');
  const [ isLoaded, setIsLoaded ] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!eventIsLoading && !events[ eventId ]) history.push('/not-found');
    else if (!eventIsLoading && events[ eventId ]) setEventGroupId(events[ eventId ].groupId)
  }, [ eventIsLoading ]);

  useEffect(() => {
    if (eventGroupId && !userIsLoading) {
      if (!memberships[ eventGroupId ]) history.push('/not-authorized');
      else if (memberships[ eventGroupId ]) memberships[ eventGroupId ].status !== 'co-host' ? history.push('/not-authorized') : setIsLoaded(true);
    }
  }, [ memberships, eventGroupId ]);

  useEffect(() => {
    dispatch(thunkLoadSingleEvent(eventId))
      .then(({ Event }) => {
        if (Event && Event.id) {
          setName(Event.name);
          setDescription(Event.description);
          setType(Event.type);
          setStartDate(Event.startDate.slice(0, 10));
          setStartTime(Event.startDate.slice(11));
          setEndDate(Event.endDate.slice(0, 10));
          setEndTime(Event.endDate.slice(11));
          setPrice(Event.price || 0);
          setCapacity(Event.capacity || '');
          setPreviewImage(Event.previewImage || '');
        };
      });
  }, [ dispatch ]);

  useEffect(() => {
    if (!name || !description || !type || (!price && price !== 0)) setDisableSubmit(true);
    else setDisableSubmit(false);
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

    if (response.statusCode >= 400) {
      return setErrors([ response.message ]);
    };

    if (response.ok) {
      history.push(`/events/${eventId}`);
    };
    return;
  };

  return (
    <>
      {isLoaded && (
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
      )}
    </>
  )
}

export default EditEventPage;
