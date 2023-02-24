import React from "react";
import { useSelector } from "react-redux";
import FeaturesBar from "../FeaturesBar";
import GroupIndexCard from "./GroupIndexCard";
import './GroupsPage.css'

const AllGroupsPage = () => {

  const groupsObj = useSelector(state => state.groups.groups);
  const groups = Object.values(groupsObj);

  return (
    <div className="groups-index-page">
      <FeaturesBar />
      <div className="groups-index-page-wrapper">
        <div className="groups-index-container">
          {
            groups.map((group) => (
              <GroupIndexCard group={group} />
            ))
          }
        </div>
      </div>
    </div >
  );
};

export default AllGroupsPage;
