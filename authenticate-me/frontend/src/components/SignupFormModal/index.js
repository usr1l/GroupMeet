// frontend/src/components/SignupFormPage/index.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import Button from "../Button";
import './SignupForm.css';
import icon from '../../images/g-icon.png';
import { thunkLogin } from "../../store/session";

function SignupFormModal() {
  const dispatch = useDispatch();
  const demoUser = async () => {
    const user = {
      credential: 'Demo-lition',
      password: 'password'
    };

    dispatch(thunkLogin(user))
      .then(closeModal);
    return;
  };

  const [ email, setEmail ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.thunkSignup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    };

    return setErrors([ 'Confirm Password field must be the same as the Password field' ]);
  };

  return (

    <div className="sign-up">
      <i onClick={closeModal} className="fa-solid fa-xmark"></i>
      <img src={icon} id='icon'></img>
      <h1 id="sign-up__title">Sign Up</h1>
      <form className="sign-up__form" onSubmit={handleSubmit}>
        <ul className="sign-up__error-list">
          {errors.map((error, idx) => (
            <li class="sign-up__error" key={idx}>
              {error}
            </li>
          ))}
        </ul>
        <label className="sign-up__label">
          Email
        </label>
        <input
          class="sign-up__input"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="sign-up__label">
          Username
        </label>
        <input
          class="sign-up__input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="sign-up__label">
          First Name
        </label>
        <input
          class="sign-up__input"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <label className="sign-up__label">
          Last Name
        </label>
        <input
          class="sign-up__input"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <label className="sign-up__label">
          Password
        </label>
        <input
          class="sign-up__input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="sign-up__label">
          Confirm Password
        </label>
        <input
          class="sign-up__input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </form>
      <Button onClick={handleSubmit} buttonStyle='btn--wide' buttonSize='btn--modal'>Sign Up</Button>
      <p id='question'>
        Click the Sign Up button to register now! Or login as a guest below.
      </p>
      <Button onClick={demoUser} buttonStyle='btn--wide' buttonSize='btn--modal'>Guest Login</Button>
    </div>

  );
}

export default SignupFormModal;
