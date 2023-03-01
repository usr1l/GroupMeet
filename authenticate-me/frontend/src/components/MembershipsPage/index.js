import React from "react";
import IconDescriptionCard from "../IconDescriptionCard";
import './MembershipsPage.css';

const MembershipsPage = ({ members }) => {

  return (
    <div className="membership-page-background">
      {members.firstName}
    </div>
  )
}

export default MembershipsPage;
