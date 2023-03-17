import React from "react";
import './GroupsPage.css';
import IconDescriptionCard from "../IconDescriptionCard";

const GroupAboutPage = ({
  about,
  hostName,
  status
}) => {
  return (
    <>
      <div className="group-propery-page-element">
        <h2 id='group-about-header'>
          What we're about:
        </h2>
        <div id='group-about-text'>
          {about}
        </div>
      </div>
      <section className="group-property-page-section">
        <div className="group-property-page-section-header">Organizer</div>
        <IconDescriptionCard
          cardStyle='group-page-oragnizer-element'
          iconClass="fas fa-user-circle"
          heading={hostName}
          subHeading={'Co-Host'}
        />
      </section>
    </>
  )
}

export default GroupAboutPage;
