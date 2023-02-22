import React from 'react';
import './InputDiv.css';

const divSTYLES = [ "group-form__block", "event-form__block", "date-time__block" ];
const labelSTYLES = [ "group-form__label", "event-form__label" ];
const extraSTYLES = [ "group-form__private" ];

const InputDiv = ({
  children,
  divStyle,
  labelStyle,
  extraStyles,
  label,
  labelFor
}) => {
  const checkDivStyle = divSTYLES.includes(divStyle) ? divStyle : divSTYLES[ 0 ];
  const checkLabelStyle = labelSTYLES.includes(labelStyle) ? labelStyle : labelSTYLES[ 0 ];
  const checkExtraStyles = extraSTYLES.includes(extraStyles) ? extraStyles : '';

  return (
    <div className={`input-div ${checkDivStyle} ${checkExtraStyles}`}>
      <label className={`input-label ${checkLabelStyle}`} htmlFor={labelFor}>{label}</label>
      {children}
    </div>
  )
}

export default InputDiv;
