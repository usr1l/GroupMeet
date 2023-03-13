import React from "react";
import IconDescriptionCard from "../IconDescriptionCard";
import './MembershipsPage.css';

const MembershipsPage = ({ members }) => {

  return (
    <div className="membership-page-background">
      <div className="membership-page-container">
        {members.map((member) => (
          <IconDescriptionCard
            iconClass="fas fa-user-circle"
            cardStyle={'membership-page-member-cards'}
            heading={`${member.firstName} ${member.lastName}`}
            subHeading={`${member.memberStatus}`}
          />
        ))}
      </div>
    </div>
  )
}

export default MembershipsPage;
