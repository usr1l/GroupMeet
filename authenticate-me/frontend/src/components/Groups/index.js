import React from "react";
import { useSelector } from "react-redux";
import FeaturesBar from "../FeaturesBar";
import GroupIndexCard from "./GroupIndexCard";

// import './GroupsPage.css'

const AllGroupsPage = () => {

  const groupsObj = useSelector(state => state.groups.groups);
  const groups = Object.values(groupsObj);

  return (
    <div className="events-page">
      <FeaturesBar />
      <ul className="events-index-container">
        {
          groups.map((group) => (
            <GroupIndexCard group={group} />
          ))
        }
      </ul>
    </div>
  );
};

export default AllGroupsPage;
