// frontend/src/components/ConfirmDeleteModal/index.js
import React from "react";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import icon from '../../images/g-icon.png';
import errorPageHandler from "../ErrorPage";
import { useModal } from "../../context/Modal";
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ groupId, eventId, deleteFn, directTo }) => {

  const itemId = groupId ? groupId : eventId;
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const handleCancel = async (e) => {
    e.preventDefault();
    closeModal();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const data = await dispatch(deleteFn(itemId));
    closeModal();

    if (data.ok === true) {
      history.push(`${directTo}`);
    };

    if (data.ok === false) {
      errorPageHandler(data);
    };

    return;
  };


  return (
    <div className="delete-modal-background">
      <i onClick={closeModal} className="fa-solid fa-xmark"></i>
      <img src={icon} id='icon' alt={'group-me'} />
      <div className="delete-modal-label">
        This action is irreversible.
        <br />
        Relevant information could be lost.
        <br />
        Do you wish to continue?
      </div>
      <div className="delete-modal-buttons">
        <Button buttonStyle='btn--big' buttonSize='btn--large' onClick={handleCancel}>Cancel</Button>
        <Button buttonStyle='btn--delete' buttonSize='btn--large' onClick={handleDelete}>Confirm</Button>
      </div>
    </div>
  )
};

export default ConfirmDeleteModal;
