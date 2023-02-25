import React from "react";
import './IconDescriptionCard.css'

const IconDescriptionCard = ({
  style,
  iconClass,
  iconId,
  heading,
  subHeading
}) => {

  const STYLES = [ '', 'group-page-oragnizer-element' ];
  const checkDivStyle = STYLES.includes(style) ? style : STYLES[ 0 ];

  return (
    <div className="icon-description-card-container" id={checkDivStyle}>
      <div className="icon-description-card">
        <i className={`${iconClass} icon-description-card-element`} id={iconId} />
        <div className="icon-description-card-element">
          <div className="icon-description-card-element-heading">{heading}</div>
          <div className="icon-description-card-element-subheading">{subHeading}</div>
        </div>
      </div>
    </div>
  )
}

export default IconDescriptionCard;
