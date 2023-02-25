import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { thunkDeleteGroup, thunkLoadSingleGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import ImagePreview from "../ImagePreview";
import NotFoundPage from "../NotFoundPage";
import IconLabel from "../IconLabel";
import Button from "../Button";
import IconDescriptionCard from '../IconDescriptionCard';
import "./SingleGroupPage.css";

const SingleGroupPage = ({ groupData }) => {

  const { groupId } = useParams();
  if (isNaN(parseInt(groupId))) return (<NotFoundPage />)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkLoadSingleGroup(groupId));
  }, [ dispatch, groupId ]);

  const { user } = useSelector(state => state.session);
  const group = useSelector(state => state.groups.group);

  if (Object.keys(group).length < 4) return (<div>Not Found</div>);

  const history = useHistory();

  let { name, about, type, city, state, organizerId, previewImage, numMembers, Organizer } = group;
  const isPrivate = group.private === true ? 'Private' : 'Public';

  const organizerFn = () => {
    if (user) {
      return organizerId === user.id
    };
    return false;
  }

  const organizerBool = organizerFn(user);

  const handleDelete = async (e) => {
    e.preventDefault();
    const data = await dispatch(thunkDeleteGroup({ user, groupId }));

    if (data.ok === true) {
      history.push(`/groups`);
    };

    if (data.ok === false) {
      errorPageHandler(data);
    };

    return;
  };

  return (
    <>
      <div className="group-header-background">
        <div className="group-header">
          <ImagePreview imgWrapperStyle="group-page-header-image-container" imgClassName='group-page-header-image' imgSrc={previewImage}></ImagePreview>
          <div className="group-page-description-card-container">
            <div className="group-page-description-card">
              <h2 id="single-group-page-name">{name}</h2>
              <div>
                <IconLabel iconClass={"fa-solid fa-location-dot"} labelText={`${city}, ${state}`} />
                <IconLabel iconClass={"fa-solid fa-user-group"} labelText={`${numMembers} Members • ${isPrivate} Group`} />
                <IconLabel iconClass={"fa-solid fa-user-large"} labelText={`Organized by ${Organizer.firstName} ${Organizer.lastName}`} />
              </div>
            </div>
            <div id='group-page-description-card-bottom'>
              {/* <i id='group-index-card-component-bottom-share' class="fa-regular fa-share-from-square"></i>
              <div className='group-index-card-item'>{window.location.href}</div> */}
              {organizerBool && (
                <Link to={`/groups/${groupId}/events/new`}>
                  <Button onClick={(e) => e.preventDefault} buttonStyle='btn--delete'>Create Event</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="single-group-page-navbar-background">
        <div className="single-group-page-navbar-container">
          <div className="single-group-page-navbar-wrapper">
            <div className="single-group-page-navbar">
              <div className="single-group-page-navbar-item">About</div>
            </div>
          </div>
          <div className="single-group-page-navbar-functions">
            {organizerBool && (
              <>
                <Link to={`/groups/${groupId}/edit`} className="single-group-page-edit-btn">
                  <Button buttonStyle='btn--big' buttonSize='btn--large' onClick={(e) => e.preventDefault} >Edit</Button>
                </Link>
                <Button buttonStyle='btn--delete' buttonSize='btn--large' onClick={handleDelete}>Delete</Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="group-property-page-container">
        <div className="group-property-page-wrapper">
          <div className="group-propery-page-element">
            {about}
          </div>
          <section className="group-property-page-section">
            <div className="group-property-page-section-header">Organizer</div>
            <IconDescriptionCard
              style='group-page-oragnizer-element'
              iconClass="fas fa-user-circle"
              heading='Hosted By'
              subHeading={`${user.firstName} ${user.lastName[ 0 ]}.`}
            />
          </section>
        </div>
      </div>
    </>
  )
}



export default SingleGroupPage;
