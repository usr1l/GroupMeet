import React from "react";
import BottomNav from "../BottomNav";
import { Link } from "react-router-dom";
import './NotFoundPage.css';


const NotFoundPage = () => {
  return (
    <>
      <div id='not-found-page-wrapper'>404: Page Not Found</div>
      <BottomNav>
        <Link to={`/`} className="page-return">
          <h3>
            <i className="fa-solid fa-angle-left" /> Home Page
          </h3>
        </Link>
      </BottomNav>
    </>
  )
};

export default NotFoundPage;
