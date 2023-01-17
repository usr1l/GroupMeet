import React from "react";
import { useDispatch } from "react-redux";
import { thunkLoadGroups } from "../../store/groups";

const AllGroupsPage = () => {


  const dispatch = useDispatch();

  dispatch(thunkLoadGroups())



  return (
    <div>Group Page</div>
  );
};

export default AllGroupsPage;
