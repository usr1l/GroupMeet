import React from "react";

const DropdownMenu = ({ user, feature }) => {
  return (
    <ul>
      {user ? (
        <li>{`${feature}`} feature coming soon!</li>
      ) : (
        <li>Login to see your {`${feature}`}</li>
      )}
    </ul >
  );
};

export default DropdownMenu;
