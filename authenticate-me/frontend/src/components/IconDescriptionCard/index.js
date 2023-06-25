import React from "react";
import './IconDescriptionCard.css'

const IconDescriptionCard = ({
  cardStyle,
  iconClass,
  iconId,
  heading,
  subHeading,
  children,
  previewSrc,
  previewBool = false
}) => {

  const STYLES = [ '', 'group-page-oragnizer-element', 'membership-page-member-cards' ];
  const checkDivStyle = STYLES.includes(cardStyle) ? cardStyle : STYLES[ 0 ];

  return (
    <div className="icon-description-card-container" id={checkDivStyle}>
      <div className="icon-description-card">
        {previewBool ? (
          <div
            style={{
              "width": "50px",
              "height": "50px",
              "border": "50%"
            }}
          >
            <img
              style={{
                "height": "100%",
                "width": "100%"
              }}
              src={previewSrc}></img>
          </div>
        ) : (
          <i className={`${iconClass} icon-description-card-element`} id={iconId} />
        )}
        <div className="icon-description-card-element">
          <div className="icon-description-card-element-heading">{heading}</div>
          <div className="icon-description-card-element-subheading">{subHeading}</div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default IconDescriptionCard;
