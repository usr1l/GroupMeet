// frontend/src/components/Navigation/OpenModalMenuItem.js
import React from 'react';
import { useModal } from '../../context/Modal';
import Button from '../Button';

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  buttonStyle,  // optional: change button style
  buttonSize // optional: change button size
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  const STYLE = buttonStyle ? buttonStyle : 'btn--menu-item';
  const SIZE = buttonSize ? buttonSize : 'btn--menu';

  return (
    <Button buttonStyle={STYLE} buttonSize={SIZE} onClick={onClick}>{itemText}</Button>
  );
}

export default OpenModalMenuItem;
