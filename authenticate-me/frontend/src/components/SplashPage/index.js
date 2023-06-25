import React from "react";
import './splashpage.css';
import { useDispatch } from "react-redux";
import { thunkLogin } from "../../store/session";
import Button from "../Button";
import selfie from "../../images/download.png"
import connect from '../../images/connect.jpg';
import friends from '../../images/friends.jpg';
import outdoors from '../../images/outdoors.jpg';
import { useHistory } from "react-router-dom";

const SplashPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const demoUser = async () => {
    const user = {
      credential: 'Demo-lition',
      password: 'password'
    };
    const response = dispatch(thunkLogin(user));
    return response;
  };

  return (
    <div className="splashpage-container">
      <div id='content-welcome-block'>
        <div id="content-welcome">
          <h1>Welcome to GroupMeet!</h1>
          <span>
            Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on GroupMeet.
          </span>
          <br></br>
          <span>
            Your next adventure is just a click away—sign up today and join the fun.
          </span>
        </div>
        <img src={selfie} id='selfie-image' alt={'preview'}></img>
      </div>
      <div id="content-images">
        <div>
          <img src={friends} className='content-row-image' alt={'preview'}></img>
          <br></br>
          Make new friends.
        </div>
        <div>
          <img src={outdoors} className='content-row-image' alt={'preview'}></img>
          <br></br>
          Explore the outdoors.
        </div>
        <div>
          <img src={connect} className='content-row-image' alt={'preview'}></img>
          <br></br>
          Connect over tech.
        </div>
      </div>
      <div id="splash-page-buttons-container">
        <Button onClick={demoUser} buttonStyle='btn--demo' id='demo-button'>Demo User</Button>
        <Button onClick={() => history.push('/events')} buttonStyle='btn--demo' id='demo-button'>Try GroupMeet</Button>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div id='links'>
        <div>Tony Zheng</div>
        <div id='link-icons'>
          <a href="https://www.linkedin.com/in/tony-zheng-577840156/" target="_blank">
            <i class="fa-brands fa-linkedin"></i>
          </a>
          <a href="https://github.com/usr1l" target="_blank">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="https://usr1l.github.io/#" target="_blank">
            <i class="fa-solid fa-globe"></i>
          </a>
        </div>
      </div>

    </div>
  )
};

export default SplashPage;
