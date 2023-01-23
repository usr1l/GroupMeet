import React from "react";
import { NavLink } from "react-router-dom";
import './GroupsPage.css';


function GroupIndexCard({ group }) {
  const { id, name, about, state, type, previewImage } = group;

  return (
    <li key={`${name}-${id}`}>
      <NavLink to={`/groups/${id}`} className='group-index-cards-click'>
        <img src={previewImage} alt='preview' />
        <ul>
          <h1>{name}</h1>
          <li>About: {about}</li>
          <li>Location: {state}</li>
          <li>Type: {type}</li>
        </ul>
      </NavLink>
    </li>
  )

};


export default GroupIndexCard;
