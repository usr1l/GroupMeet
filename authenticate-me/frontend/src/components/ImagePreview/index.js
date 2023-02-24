import React from 'react';
import './ImagePreview.css';

const wrapperSTYLES = [ '', 'group-page-header-image-container', 'event-index-card-image-container', 'group-index-card-image-container' ];
const imgSTYLES = [ '', "group-page-header-image", 'event-index-card-image', 'group-index-card-image' ];

const ImagePreview = ({
  imgWrapperStyle,
  imgSrc,
  imgClassName,
  altTag
}) => {

  const checkWrapperStyle = wrapperSTYLES.includes(imgWrapperStyle) ? imgWrapperStyle : wrapperSTYLES[ 0 ];
  const checkImgStyle = imgSTYLES.includes(imgClassName) ? imgClassName : imgSTYLES[ 0 ];

  return (
    <div className={`img-preview-wrapper ${checkWrapperStyle}`}>
      <img src={imgSrc} className={`img-preview ${checkImgStyle}`} alt={altTag}></img>
    </div>
  )
}

export default ImagePreview;
