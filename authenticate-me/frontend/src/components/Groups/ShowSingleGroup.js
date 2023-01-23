import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { thunkDeleteGroup, thunkLoadSingleGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";
import './SingleGroupPage.css'

const SingleGroupPage = ({ groupData }) => {
  const { groupId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkLoadSingleGroup(groupId));
  }, [ dispatch, groupId ])
  const { user } = useSelector(state => state.session);

  const groupState = useSelector(state => state.groups);
  if (groupState.status === true) return (<div>Loading...</div>)
  const group = useSelector(state => state.groups.groups[ groupId ]);
  if (!group) return (<div>Not Found</div>);

  const history = useHistory();

  let { name, about, type, city, state, organizerId, previewImage } = group;

  const organizerBool = organizerId === user.id;
  // can still use group.private

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
      <div className="single-group-page-container" id="single-group-page">
        <img src={previewImage} alt='preview' className="single-group-page-image"></img>
        <ul className="single-group-page-info">
          <h2 className="single-group-page-name">{name}</h2>
          <li className="single-group-page-about">{about}</li>
          <li className="single-group-page-type">{type}</li>
          <li className="single-group-page-location">{city}</li>
          <li className="single-group-page-location">{state}</li>
          <li className="single-group-page-organizer">{organizerId}</li>
        </ul>
        {organizerBool && (
          <>
            <NavLink to={`/groups/${groupId}/edit`} className="single-group-page-edit-btn">Edit</NavLink>
            <button onClick={handleDelete} className="single-group-page-delete-btn">Delete</button>
            <NavLink to={`/groups/${groupId}/events/new`} className="single-group-page-create-event-btn">Create An Event</NavLink>
          </>
        )}
      </div>
    </>
  )
}



export default SingleGroupPage;
