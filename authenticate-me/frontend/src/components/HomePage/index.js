import React from "react";
import { useSelector } from "react-redux";
// import { NavLink } from "react-router-dom";
import FeaturesBar from "../FeaturesBar";

const HomePage = () => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
      <FeaturesBar />

    </>
  )
};

export default HomePage;
