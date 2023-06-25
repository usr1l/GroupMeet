import React from "react";
import FeaturesBar from "../FeaturesBar";
import './HomePage.css';

const HomePage = () => {

  return (
    <>
      <FeaturesBar />
      <div id='homepage-welcome'>
        <div>

          Welcome to GroupMeet!
        </div>
        <br />
        <br />
        <br />
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
    </>
  )
};

export default HomePage;
