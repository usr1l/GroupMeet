import React from "react";
import './BottomNav.css';

const BottomNav = ({
  children,
  navStyle
}) => {
  return (
    <div className={`bottom-nav-wrapper ${navStyle}`}>
      {children}
    </div>
  )
}

export default BottomNav;
