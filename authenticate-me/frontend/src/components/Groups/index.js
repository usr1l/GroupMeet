import React from "react";
import { useSelector } from "react-redux";
import FeaturesBar from "../FeaturesBar";
import GroupsList from "./GroupsList";
import './GroupsPage.css'

const AllGroupsPage = () => {

  const groupsObj = useSelector(state => state.groups.groups);
  const groups = Object.values(groupsObj);

  return (
    <div className="groups-index-page">
      <FeaturesBar />
      <h2 className='groups-events-header'>Groups in GroupMeet</h2>
      <GroupsList groups={groups} />
    </div>
  );
};

export default AllGroupsPage;
