import React from "react";
import IconDescriptionCard from "../IconDescriptionCard";
import './MembershipsPage.css';

const MembershipsPage = ({ members }) => {

  return (
    <div className="membership-page-background">
      {members.map((member) => (
        <IconDescriptionCard
          iconClass="fas fa-user-circle"
          heading={member.firstName}
          subHeading={member.lastName}
        />
      ))}
    </div>
  )
}

export default MembershipsPage;
