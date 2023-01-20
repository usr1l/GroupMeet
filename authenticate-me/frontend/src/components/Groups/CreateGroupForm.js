import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";

const CreateGroupForm = () => {
  const states = [ "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY" ];
  const history = useHistory();
  const sessionUserId = useSelector(state => state.session.user.id);
  // const groupsObj = useSelector(state => state.groups.groups)
  // const groups = Object.values(groupsObj)

  const dispatch = useDispatch();

  const [ name, setName ] = useState("");
  const [ about, setAbout ] = useState("");
  const [ type, setType ] = useState("");
  const [ isPrivate, setIsPrivate ] = useState('private');
  const [ city, setCity ] = useState("");
  const [ state, setState ] = useState("");
  const [ errors, setErrors ] = useState([]);


  const validate = () => {
    const validationErrors = [];

    if (!name) validationErrors.push('Please provide a name for your event');
    if ((!about) || (about.length < 50)) validationErrors.push('About must be at least 50 characters')

    if (!type) validationErrors.push('Please specify the type')

    if (!city || !state) validationErrors.push('Please provide the location for this group')

    // for (const group of groups) {
    //   if (
    //     group.name == name &&
    //     group.about === about &&
    //     group.type === type &&
    //     group.private === (isPrivate === 'private' ? true : false) &&
    //     group.city === city &&
    //     group.state === state &&
    //     group.organizerId === sessionUserId
    //   ) {
    //     validationErrors.push('This group already exists')
    //   }
    // }

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
      isPrivate: (isPrivate === 'private' ? true : false),
      city,
      state,
      organizerId: sessionUserId
    };

    const data = await dispatch(thunkCreateGroup(groupInfo))

    if (data.statusCode === 409) {
      setErrors([ data.message ]);
      return errors;
    }
    history.push(`/groups/${data.id}`);
    return;
  };


  return (
    <div>
      <h2>CREATE A GROUP</h2>
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
        {/* <label htmlFor="private-radio-buttons">This event is: </label> */}
        <div className='form-row' name='private-radio-buttons'>
          <input type="radio" value="private"
            name="isPrivate" id='isPrivate-yes-button'
            checked={isPrivate === "private" ? "checked" : ""}
            onChange={(e) => setIsPrivate(e.target.value)}
          /> Private
          <input type="radio" value="public"
            name="isPrivate" id='isPrivate-no-button'
            checked={isPrivate === "public" ? "checked" : ""}
            onChange={(e) => setIsPrivate(e.target.value)}
          /> Public
          <br />
          {/* <input type="checkbox" value="yes" id='checked'
            onChange={({ target: { value, checked } }) => {
              setChecked((checked ? value : ""))
            }
            }
            checked={checked === '' ? '' : "checked"}
          /> Sign up for our email list? */}
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default CreateGroupForm;
