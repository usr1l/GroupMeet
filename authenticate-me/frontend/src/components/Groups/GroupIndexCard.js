import React from "react";
import { Link } from "react-router-dom";
import ImagePreview from "../ImagePreview";
import './GroupsPage.css';


function GroupIndexCard({ group }) {
  const { id, name, about, state, type, numMembers, previewImage, city } = group;

  return (
    <Link to={`/groups/${id}`}>
      <div className='group-index-cards-click'>
        <ImagePreview imgSrc={previewImage} imgWrapperStyle='group-index-card-image-container' imgClassName='group-index-card-image' />
        <div key={`${name}-${id}`} className='group-index-card'>
          <ul className='group-index-card-component'>
            <h2 className='group-index-card-item'>{name}</h2>
            <li className='group-index-card-item' id='group-index-card-item-location'>{state}, {city}</li>
          </ul>
          <div className='group-index-card-component'>
            <div className='group-index-card-item' id="group-index-card-item-about">{about}</div>
          </div>
          <div className='group-index-card-component' id='group-index-card-component-bottom'>
            <div className='group-index-card-item'>{numMembers} members</div>
            <i className='group-index-card-item' class="fa-solid fa-circle"></i>
            <div className='group-index-card-item'>{type}</div>
          </div>
        </div>
      </div>
    </Link>
  )
};


export default GroupIndexCard;
