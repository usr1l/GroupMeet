import React, { useEffect, useState } from 'react';

import "./ImageUpload.css";
import Button from '../Button';

const ImageUpload = () => {
  const [ images, setImages ] = useState(null);
  const [ fileNames, setFileNames ] = useState([]);

  const handleFileUpload = (e) => {
    const names = [];
    const files = e.target.files;
    if (files) {
      setImages(images);
      for (const key in files) {
        if (key !== 'length' && key !== 'item') {
          names.push(files[ key ].name);
        };
      };
      setFileNames(names);
    };
  };

  return (
    <div className="preview-component">
      <div style={{ display: "flex", width: "90%", justifyContent: "space-around" }}>
        <div >
          <input className="file-input"
            onChange={handleFileUpload}
            type="file"
            accept=".jpg, .jpeg, .png"
            multiple
          />
        </div>
        <Button buttonSize={"btn--small"} buttonStyle={"btn--delete"}>Upload</Button>
      </div>
      <div style={{
        border: "1px dashed grey",
        height: "300px",
        width: "90%",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="scrollable-div">
          {fileNames.map((file) => (
            <div className='scroll-item'>{file}</div>
          ))}
        </div>
      </div>
    </div>
  )
};

export default ImageUpload;
