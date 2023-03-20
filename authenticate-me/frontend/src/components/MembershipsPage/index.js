import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkGroupAcceptMembership, thunkGroupDeleteMembership } from "../../store/groups";
import Button from "../Button";
import IconDescriptionCard from "../IconDescriptionCard";
import './MembershipsPage.css';

const MembershipsPage = ({ members, organizerBool, groupId }) => {

  const dispatch = useDispatch();

  const [ editState, setEditState ] = useState(false);
  const [ editText, setEditText ] = useState('Edit');

  const toggleEditMode = (e) => {
    e.preventDefault();
    setEditState(!editState);
    setEditText(editText === 'Edit' ? 'Cancel' : 'Edit');
    return;
  };

  const handleAccept = (e) => {
    e.preventDefault();
    const memberId = e.target.value;
    const statusChange = 'member';
    const data = { memberId: memberId, statusChange: statusChange, groupId: groupId };
    dispatch(thunkGroupAcceptMembership(data));
    return;
  };

  const handleReject = (e) => {
    e.preventDefault();
    const memberId = e.target.value;
    const removeBool = false;
    const data = { groupId: groupId, memberId: memberId, removeBool };
    dispatch(thunkGroupDeleteMembership(data));
    return;
  };

  const handleRemove = (e) => {
    e.preventDefault();
    const memberId = e.target.value;
    const removeBool = true;
    const data = { groupId: groupId, memberId: memberId, removeBool };
    dispatch(thunkGroupDeleteMembership(data));
    return;
  };

  return (
    <div id="membership-page-background">
      <h2>All Members
        {organizerBool && (
          <Button onClick={toggleEditMode} buttonStyle='btn--remove' buttonSize={'btn--medium'}>{editText}</Button>
        )}
      </h2>
      <div id="membership-page-wrapper">
        <div id="membership-page-container">
          {members.map((member) => (
            <div key={`membership-card-${member.id}-${member.lastName}`} id="membership-page-card">
              <IconDescriptionCard
                iconClass="fas fa-user-circle"
                cardStyle={'membership-page-member-cards'}
                heading={`${member.firstName} ${member.lastName}`}
                subHeading={`${member.memberStatus.toUpperCase()}`}
              />
              {organizerBool && member.memberStatus === 'pending' && (
                <div id="memberships-page-button-wrapper">
                  <div className="button-container">
                    <div className='membership-button-wrapper'>
                      <Button value={`${member.id}`} onClick={handleAccept} buttonStyle={'btn--accept'} buttonSize={'btn--small'}>Confirm</Button>
                      <span className="btn--accept-shadow"></span>
                    </div>
                  </div>
                  <div className="button-container">
                    <div className='membership-button-wrapper'>
                      <Button buttonStyle={'btn--reject'} value={`${member.id}`} onClick={handleReject} buttonSize={'btn--small'}>Reject</Button>
                      <span className="btn--reject-shadow"></span>
                    </div>
                  </div>
                </div>
              )}
              {organizerBool && editState && member.memberStatus === 'member' && (
                <div id="memberships-page-button-wrapper">
                  <div className="button-container membership-remove">
                    <div className='membership-button-wrapper'>
                      <Button value={`${member.id}`} onClick={handleRemove} buttonStyle='btn--remove' buttonSize={'btn--medium'}>Remove</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div >
  )
}

export default MembershipsPage;
