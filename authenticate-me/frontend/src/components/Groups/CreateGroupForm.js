import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateGroup, thunkLoadGroups } from "../../store/groups";
import { useHistory } from "react-router-dom";
import Button from '../Button';
import InputDiv from "../InputDiv";
import ImagePreview from "../ImagePreview";
import './GroupForm.css';



const CreateGroupForm = () => {
  const states = [ "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY" ];
  const history = useHistory();
  const sessionUserId = useSelector(state => state.session.user.id);

  const dispatch = useDispatch();

  const [ name, setName ] = useState("");
  const [ about, setAbout ] = useState("");
  const [ type, setType ] = useState("");
  const [ isPrivate, setIsPrivate ] = useState('true');
  const [ city, setCity ] = useState("");
  const [ state, setState ] = useState("");
  const [ previewImage, setPreviewImage ] = useState("");
  const [ errors, setErrors ] = useState([]);


  const validate = () => {
    const validationErrors = [];

    if (!name || name.length > 60) validationErrors.push('Please provide a name for your event (60 characters max)');
    if ((!about) || (about.length < 50)) validationErrors.push('About must be at least 50 characters')

    if (!type) validationErrors.push('Please specify the type')

    if (!city || !state) validationErrors.push('Please provide the location for this group')

    return validationErrors;
  };



  const onSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (validationErrors.length > 0) return setErrors(validationErrors);

    const groupInfo = {
      name,
      about,
      type,
      isPrivate: (isPrivate === 'true' ? true : false),
      city,
      state,
      organizerId: sessionUserId,
      previewImage
    };

    const data = await dispatch(thunkCreateGroup(groupInfo));

    if (data.statusCode === 409) {
      setErrors([ data.message ]);
      return errors;
    };

    await thunkLoadGroups();
    history.push(`/groups/${data.id}`);
    return;
  };


  return (
    <div id='create-group-page'>
      <h2 id="group-form__title">CREATE A GROUP</h2>
      <ul id='group-form__error-list'>
        {!!errors.length && (
          errors.map((error) => (
            <li key={error}>{error}</li>
          ))
        )}
      </ul>
      <form id="group-form" onSubmit={onSubmit}>
        <InputDiv divStyle="group-form__block" labelStyle="group-form__label" labelFor="name" label='Name: '>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </InputDiv>
        <InputDiv divStyle="group-form__block" labelStyle="group-form__label" labelFor="type" label='Type: '>
          <select
            className="group-form__label"
            name="type"
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
        <InputDiv divStyle="group-form__block" labelStyle="group-form__label" labelFor="city" label='City: '>
          <input
            id="city"
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
        </InputDiv>
        <InputDiv divStyle="group-form__block" labelStyle="group-form__label" labelFor="state" label='State: '>
          <select
            name="state"
            className="group-form__label"
            onChange={(e) => setState(e.target.value)}
            value={state}
          >
            <option value="" disabled>
              select:
            </option>
            {states.map(state => (
              <option value={state}>{state}</option>
            ))}
          </select>
        </InputDiv>
        <InputDiv divStyle="group-form__block" labelStyle="group-form__label" labelFor="about" label='About: '>
          <textarea
            id="about-input"
            name="about"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
          />
        </InputDiv>
        <div className="group-form__block group-form__private">
          <input type="radio" value="true" className='private-radio-button'
            name="isPrivate" id='isPrivate-yes-button'
            checked={isPrivate === "true" ? "checked" : ""}
            onChange={(e) => setIsPrivate(e.target.value)}
          /> Private
          <input type="radio" value="false" className='private-radio-buttons'
            name="isPrivate" id='isPrivate-no-button'
            checked={isPrivate === "false" ? "checked" : ""}
            onChange={(e) => setIsPrivate(e.target.value)}
          /> Public
        </div>
        <InputDiv divStyle="group-form__block" labelStyle="group-form__label" labelFor="group-profile-image" label='Group Image: '>
          <input
            name="group-profile-img"
            type='url'
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
        </InputDiv>
        <div id='create-group-button-div'>
          <ImagePreview imgSrc={previewImage}></ImagePreview>
          <Button type='submit' buttonStyle='btn--wide'>Create Group</Button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroupForm;
