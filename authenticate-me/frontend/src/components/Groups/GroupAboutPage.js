import React from "react";
import './GroupsPage.css';
import IconDescriptionCard from "../IconDescriptionCard";

const GroupAboutPage = ({
  about,
  user
}) => {
  return (
    <>
      <div className="group-propery-page-element">
        {about}
      </div>
      <section className="group-property-page-section">
        <div className="group-property-page-section-header">Organizer</div>
        <IconDescriptionCard
          cardStyle='group-page-oragnizer-element'
          iconClass="fas fa-user-circle"
          heading='Hosted By'
          subHeading={`${user.firstName} ${user.lastName[ 0 ]}.`}
        />
      </section>
    </>
  )
}

export default GroupAboutPage;
