import React from 'react';
import "./UploadImageAWS.css";
import InputDiv from '../InputDiv';

const UploadImageAWS = () => {
  const [ image, setImage ] = useState(null);

  const updateFile = e => {
    const file = e.target.files[ 0 ];
    if (file) setImage(file);
  };

  return (
    <InputDiv divStyle="group-form__block" labelStyle="group-form__label" labelFor="group-profile-image" label='Please add an image URL for your group below:'>
      <input
        name="group-profile-img"
        type='file'
        value={image}
        onChange={updateFile}
      />
    </InputDiv>
  )
};

export default UploadImageAWS;
