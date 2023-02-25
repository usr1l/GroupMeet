import React from "react";
import { useSelector } from "react-redux";
import FeaturesBar from "../FeaturesBar";
import GroupIndexCard from "./GroupIndexCard";
import GroupsList from "./GroupsList";
import './GroupsPage.css'

const AllGroupsPage = () => {

  const groupsObj = useSelector(state => state.groups.groups);
  const groups = Object.values(groupsObj);

  return (
    <div className="groups-index-page">
      <FeaturesBar />
      <GroupsList groups={groups} />
    </div>
  );
};

export default AllGroupsPage;
