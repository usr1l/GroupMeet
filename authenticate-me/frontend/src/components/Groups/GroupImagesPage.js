import React, { useState } from 'react';
import './GroupImagesPage.css';
import { useModal } from '../../context/Modal';
import ImageUpload from '../ImageUpload';
import ImagePreview from '../ImagePreview';
import ImagesDisplay from '../ImagesDisplay';

function GroupImagesPage({ images, groupId, organizerBool = false }) {

  const [ image, setImage ] = useState(null);

  const { setModalContent } = useModal();

  return (
    <div id='groups-images-wrapper'>
      <div id='groups-images-container'>
        {organizerBool && (

          <div
            style={{
              width: "175px",
              height: "225px",
              boxSizing: "border-box",
              margin: "30px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "15px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
              cursor: "pointer",
              color: "lightgrey"

            }}
            onClick={() => setModalContent(<ImageUpload groupId={groupId} />)}>
            <i
              style={{
                fontSize: "40px",
              }}
              class="fa-solid fa-circle-plus">
            </i>
          </div>
        )}
        {images.map((image) => (
          <div onClick={() => setModalContent(<ImagesDisplay organizerBool={organizerBool} img={image} />)} className='image-card'>
            <img src={image.url}></img>
          </div>
        ))}
      </div>
    </div >
  )
};

export default GroupImagesPage;
