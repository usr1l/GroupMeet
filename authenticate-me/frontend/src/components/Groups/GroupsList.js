import React from "react";
import GroupIndexCard from "./GroupIndexCard";
import './GroupsPage.css';

const GroupsList = ({
  groups
}) => {
  return (
    <div className="groups-index-page-wrapper">
      <div className="groups-index-container">
        {
          groups.map((group) => {
            return (
              <GroupIndexCard group={group} />
            )
          })
        }
      </div>
    </div>
  )
}

export default GroupsList;
