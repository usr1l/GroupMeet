import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateEvent } from "../../store/events";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateEventForm = () => {
  const history = useHistory();
  const sessionUserId = useSelector(state => state.session.user.id);

  const dispatch = useDispatch();

  const [ name, setName ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ type, setType ] = useState("");
  const [ startDate, setStartDate ] = useState('private');
  const [ endDate, setEndDate ] = useState("");
  const [ capacity, setState ] = useState("");
  const [ errors, setErrors ] = useState([]);


  const validate = () => {
    const validationErrors = [];

    if (!name || (name.length < 5)) validationErrors.push('Please provide a name at least 5 characters long');
    if ((!description)) validationErrors.push('A description is required')

    if (!type) validationErrors.push('Please specify the type')

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
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder='Name (min 5 characters)'
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
