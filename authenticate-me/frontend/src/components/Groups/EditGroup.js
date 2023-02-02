import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkLoadSingleGroup, thunkUpdateGroup } from "../../store/groups";

const EditGroupPage = () => {
  const states = [ "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY" ];
  const { groupId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadSingleGroup(groupId))
      .then((data) => {
        const { name, about, type, city, state, previewImage } = data;
        setName(name);
        setAbout(about);
        setType(type);
        setIsPrivate(data.private === true ? 'true' : 'false');
        setCity(city);
        setState(state);
        setPreviewImage(previewImage || '')
      });
  }, []);

  const history = useHistory();

  const [ name, setName ] = useState('');
  const [ about, setAbout ] = useState('');
  const [ type, setType ] = useState('');
  const [ isPrivate, setIsPrivate ] = useState('true');
  const [ city, setCity ] = useState('');
  const [ state, setState ] = useState('');
  const [ errors, setErrors ] = useState([]);
  const [ previewImage, setPreviewImage ] = useState('');

  const validate = () => {
    const validationErrors = [];

    if (!name || name.length > 60) validationErrors.push('Please provide a name for your event (60 characters max)');
    if ((!about) || (about.length < 50)) validationErrors.push('About must be at least 50 characters');
    if (!type) validationErrors.push('Please specify the type');
    if (!city || !state) validationErrors.push('Please provide the location for this group');

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
      previewImage
    };

    const response = await dispatch(thunkUpdateGroup(groupInfo, groupId));

    if (response.ok) {
      history.push(`/groups/${groupId}`);
    }
    return;
  };

  return (
    <div>
      <h2>EDIT GROUP</h2>
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
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder='Name'
          />
        </div>
        <div>
          <label htmlFor="type">Type: </label>
          <select
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
        </div>
        <div>
          <input
            id="city"
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
            placeholder='City'
          />
          <div>
            <label htmlFor="state">State: </label>
            <select
              name="state"
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
          </div>
        </div>
        <div>
          <textarea
            id="about"
            name="about"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            placeholder='What is your group about'
          />
        </div>
        <div className='form-row' name='private-radio-buttons'>
          <input type="radio" value="true"
            name="isPrivate" id='isPrivate-yes-button'
            checked={isPrivate === "true" ? "checked" : ""}
            onChange={(e) => setIsPrivate(e.target.value)}
          /> Private
          <input type="radio" value="false"
            name="isPrivate" id='isPrivate-no-button'
            checked={isPrivate === "false" ? "checked" : ""}
            onChange={(e) => setIsPrivate(e.target.value)}
          /> Public
        </div>
        <div>
          <label htmlFor="group-profile-img">Group Image: </label>
          <input
            name="group-profile-img"
            type='url'
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default EditGroupPage;
