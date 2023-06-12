import React, { useState } from 'react';

import "./ImageUpload.css";

const ImageUpload = () => {
  const [ images, setImages ] = useState(null);
  const [ fileNames, setFileNames ] = useState([]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files) setImages(files);
    console.log(files);
  };

  return (
    <div className="previewComponent">
      <div >
        <input className="fileInput"
          onChange={handleFileUpload}
          type="file"
          accept=".jpg, .jpeg, .png"
          multiple
        />
      </div>
      <button className="submitButton">Upload Image</button>
      <div className="imgPreview">
      </div>
    </div>
  )
};

export default ImageUpload;
