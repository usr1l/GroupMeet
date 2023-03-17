import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkUpdateMembership } from "../../store/groups";
import Button from "../Button";
import IconDescriptionCard from "../IconDescriptionCard";
import './MembershipsPage.css';

const MembershipsPage = ({ members, organizerBool }) => {
  const { groupId } = useParams();

  const dispatch = useDispatch();
  const handleAccept = (e) => {
    e.preventDefault();
    console.log(e)
    // dispatch(thunkUpdateMembership({groupId,  }))
  };

  return (
    <div id="membership-page-background">
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
                      <Button buttonStyle={'btn--accept'} buttonSize={'btn--small'}>Confirm</Button>
                      <span className="btn--accept-shadow"></span>
                    </div>
                  </div>
                  <div className="button-container">
                    <div className='membership-button-wrapper'>
                      <Button buttonStyle={'btn--reject'} buttonSize={'btn--small'}>Reject</Button>
                      <span className="btn--reject-shadow"></span>
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
