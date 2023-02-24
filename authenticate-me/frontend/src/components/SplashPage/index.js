import React from "react";
import './splashpage.css';
import { useDispatch } from "react-redux";
import { thunkLogin } from "../../store/session";
import Button from "../Button";
import selfie from "../../images/download.png"
import connect from '../../images/connect.jpg';
import friends from '../../images/friends.jpg';
import outdoors from '../../images/outdoors.jpg';

const SplashPage = () => {

  const dispatch = useDispatch();
  const demoUser = async () => {
    const user = {
      credential: 'Demo-lition',
      password: 'password'
    };

    const response = dispatch(thunkLogin(user));
    return response;
  }


  return (
    <div className="splashpage-container">
      <div id='content-welcome-block'>
        <div id="content-welcome">
          <h1>Welcome to GroupMeet!</h1>
          <text>
            Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on GroupMeet.
            <br></br>
            <br></br>
            Your next adventure is just a click away—sign up today and join the fun.
          </text>
        </div>
        <img src={selfie} id='selfie-image'></img>
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
      <Button onClick={demoUser} buttonStyle='btn--demo' id='demo-button'>Join Today</Button>
    </div>
  )
};

export default SplashPage;
