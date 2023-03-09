import React from 'react';
import './Button.css';

const STYLES = [ 'btn--primary', 'btn--outline', 'btn--demo', 'btn--wide', 'btn--menu-item', 'btn--big', 'btn--delete' ];
const SIZES = [ 'btn--medium', 'btn--large', 'btn--modal', 'btn--menu' ];

const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  // disableButton
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[ 0 ];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[ 0 ];

  return (
    <div className='btn-mobile'>
      <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
      // disabled={disableButton || false}
      >
        {children}
      </button>
    </div>
  )
}

export default Button;
