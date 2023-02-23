import React from "react";
import { NavLink, Link } from "react-router-dom";
// import './GroupsPage.css';


function GroupIndexCard({ group }) {
  const { id, name, about, state, type, previewImage } = group;

  return (
    <li key={`${name}-${id}`} className='group-index-card'>
      <Link to={`/groups/${id}`} className='group-index-card-components-wrapper group-index-cards-click'>
        <img src={previewImage} alt='preview' className="group-index-image" />
        <ul className='group-index-card-component'>
          <h1 className='group-index-card-item'>{name}</h1>
          <li className='group-index-card-item'>About: {about}</li>
          <li className='group-index-card-item'>Location: {state}</li>
          <li className='group-index-card-item'>Type: {type}</li>
        </ul>
      </Link>
    </li >
  )
};


export default GroupIndexCard;
