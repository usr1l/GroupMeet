import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleGroupPage = () => {
  const group = useSelector(state => state.groups);
  console.log(group, useParams());
  return (
    <div>SingleGroupPage</div>
  )
}

export default SingleGroupPage;
