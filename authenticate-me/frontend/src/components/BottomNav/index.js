import React from "react";
import './BottomNav.css';

const BottomNav = ({
  children,
  navStyle
}) => {
  return (
    <div className={`bottom-nav-wrapper ${navStyle}`}>
      <div className="groups-bottom-nav-wrapper">
        {children}
      </div>
    </div >
  )
}

export default BottomNav;
