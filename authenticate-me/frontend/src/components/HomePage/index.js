import React from "react";
import { useSelector } from "react-redux";
import FeaturesBar from '../FeaturesBar';

const HomePage = () => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
      <FeaturesBar />
      <div>Welcome, {`${sessionUser.firstName}`} </div>
    </>
  )
};

export default HomePage;
