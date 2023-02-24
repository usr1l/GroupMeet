import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { thunkDeleteGroup, thunkLoadSingleGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import ImagePreview from "../ImagePreview";
import NotFoundPage from "../NotFoundPage";
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

  let { name, about, type, city, state, organizerId, previewImage, numMembers } = group;
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
        <ImagePreview imgWrapperStyle="group-page-header-image-container" imgClassName='group-page-header-image' imgSrc={previewImage}></ImagePreview>
        <div>
          <h2 className="single-group-page-name">Name: {name}</h2>
          <div>
            <div>
              <i class="fa-solid fa-location-dot"></i>
              <text>{city}, {state}</text>
            </div>
            <div>
              <i class="fa-solid fa-user-group"></i>
              <text>{numMembers} Members, {isPrivate} Group</text>
            </div>
            <div>
              <i class="fa-solid fa-user-large"></i>
              <text>Organized by User {user.id}</text>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      {/* <nav></nav> */}
      <div className="single-group-page-container" id="single-group-page">
        <ul className="single-group-page-info">
          <li className="single-group-page-about">About: {about}</li>
          <li className="single-group-page-type">Type: {type}</li>

        </ul>
        {organizerBool && (
          <>
            <NavLink to={`/groups/${groupId}/edit`} className="single-group-page-edit-btn">Edit</NavLink>
            <button onClick={handleDelete} className="single-group-page-delete-btn">Delete</button>
            <NavLink to={`/groups/${groupId}/events/new`} className="single-group-page-create-event-btn">Create An Event</NavLink>
          </>
        )}
      </div>
      <div className="group-page-sticky">
      </div>
    </>
  )
}



export default SingleGroupPage;
