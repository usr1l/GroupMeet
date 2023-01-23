import React from "react";
import { useSelector } from "react-redux";
// import { thunkLoadGroups } from "../../store/groups";
import GroupIndexCard from "./GroupIndexCard";
import './GroupsPage.css'

const AllGroupsPage = () => {

  const groupsObj = useSelector(state => state.groups.groups);
  const groups = Object.values(groupsObj);

  return (
    <section className="events-page">
      <ul className="events-index-container">
        {
          groups.map((group) => (
            <GroupIndexCard group={group} />
          ))
        }
      </ul>
    </section>
  );
};

export default AllGroupsPage;
