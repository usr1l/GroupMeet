import React from 'react';
import './ImagePreview.css';

const wrapperSTYLES = [ '', 'group-page-header-image-container' ];
const imgSTYLES = [ '', "group-page-header-image" ];

const ImagePreview = ({
  imgWrapperStyle,
  imgSrc,
  imgClassName
}) => {

  const checkWrapperStyle = wrapperSTYLES.includes(imgWrapperStyle) ? imgWrapperStyle : wrapperSTYLES[ 0 ];
  const checkImgStyle = imgSTYLES.includes(imgClassName) ? imgClassName : imgSTYLES[ 0 ];

  return (
    <div className={`img-preview-wrapper ${checkWrapperStyle}`}>
      <img src={imgSrc} className={`img-preview ${checkImgStyle}`}></img>
    </div>
  )
}

export default ImagePreview;
