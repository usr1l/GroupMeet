// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import icon from '../../images/g-icon.png';
import "./LoginForm.css";
import Button from "../Button";
import { thunkLogin } from "../../store/session";

function LoginFormModal() {
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
  const [ credential, setCredential ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.thunkLogin({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <div id='log-in'>
      <i onClick={closeModal} className="fa-solid fa-xmark"></i>
      <img src={icon} id='icon'></img>
      <h1 id="log-in__title">Log In</h1>
      <form id='log-in__form' onSubmit={handleSubmit}>
        <ul id='log-in__error-list'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label id='log-in__label'>
          Username or Email
        </label>
        <input
          id='log-in__input'
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <label id='log-in__label'>
          Password
        </label>
        <input
          id='log-in__input'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </form>
      <Button onClick={handleSubmit} buttonSize='btn--modal' buttonStyle='btn--wide'>Log In</Button>
      <div id='separator'></div>
      <Button onClick={demoUser} buttonSize='btn--modal' buttonStyle='btn--wide'>Log In as Guest</Button>
    </div>
  );
}

export default LoginFormModal;
