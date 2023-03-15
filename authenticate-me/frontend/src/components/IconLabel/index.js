import React from "react";
import './IconLabel.css';

const IconLabel = ({
  iconClass,
  labelText

}) => {

  return (
    <div className="icon-label-component">
      <div className="icon-label-item-image-container">
        <i className={`icon-label-item-image ${iconClass}`}></i>
      </div>
      <span className="icon-label-item-text">{labelText}</span>
    </div>
  )
}

export default IconLabel;
