import React from "react";
import './IconLabel.css';

const IconLabel = ({
  iconClass,
  labelText

}) => {

  return (
    <div className="icon-label-component">
      <div className="icon-label-item-image-container">
        <i className="icon-label-item-image" class={iconClass}></i>
      </div>
      <text className="icon-label-item-text">{labelText}</text>
    </div>
  )
}

export default IconLabel;
