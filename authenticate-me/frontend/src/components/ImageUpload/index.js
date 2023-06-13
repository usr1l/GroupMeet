import React, { useEffect, useRef, useState } from 'react';

import "./ImageUpload.css";
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { thunkUploadImages } from '../../store/groups';
import { useModal } from '../../context/Modal';

const ImageUpload = ({ groupId }) => {
  const dispatch = useDispatch();
  const [ images, setImages ] = useState();
  const [ fileNames, setFileNames ] = useState([]);
  const [ disableBool, setDisableBool ] = useState(true);

  const { closeModal } = useModal();

  const handleFileUpload = (e) => {
    const names = [];
    const files = e.target.files;
    if (files) {
      setImages(files);
      for (const key in files) {
        if (key !== 'length' && key !== 'item') {
          names.push(files[ key ].name);
        };
      };
      setFileNames(names);
      setDisableBool(false);
    } else setDisableBool(true);
  };

  const confirmUpload = () => {
    const res = dispatch(thunkUploadImages(images, groupId));
    closeModal();

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
        <Button
          disableButton={disableBool}
          onClick={confirmUpload}
          buttonSize={"btn--small"}
          buttonStyle={"btn--delete"}>Upload</Button>
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
