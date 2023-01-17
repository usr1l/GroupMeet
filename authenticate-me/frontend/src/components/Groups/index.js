import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLoadGroups } from "../../store/groups";
import GroupIndexCard from "./GroupIndexCard";
import './GroupsPage.css'

const AllGroupsPage = () => {
  const dispatch = useDispatch();

  const groupsObj = useSelector(state => state.groups.groups);
  const groups = Object.values(groupsObj);

  useEffect(() => {
    dispatch(thunkLoadGroups());
  }, [ dispatch ]);

  return (
    <section>
      <ul>
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
