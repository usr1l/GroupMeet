import React from "react";
import BottomNav from "../BottomNav";
import { Link } from "react-router-dom";
import './UnauthorizedPage.css';


const UnauthorizedPage = ({
  navLink,
  redirectLabel
}) => {
  return (
    <>
      <div id='not-found-page-wrapper'>401: You Are Not Authorized</div>
      <BottomNav>
        <Link to={navLink ? navLink : '/'} className="page-return">
          <h3>
            <i className="fa-solid fa-angle-left" /> {redirectLabel ? redirectLabel : 'Home Page'}
          </h3>
        </Link>
      </BottomNav>
    </>
  )
};

export default UnauthorizedPage;
