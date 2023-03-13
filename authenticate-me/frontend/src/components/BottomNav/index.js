import React from "react";
import './BottomNav.css';

const BottomNav = ({
  children,
  navStyle,
  pageType
}) => {
  return (
    <div className={`bottom-nav-wrapper ${navStyle}`}>
      <div className={`page-bottom-nav-wrapper ${pageType}-bottom-nav-wrapper`}>
        {children}
      </div>
    </div >
  )
}

export default BottomNav;
