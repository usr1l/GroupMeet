import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, NavLink } from "react-router-dom";
import { thunkDeleteGroup, thunkLoadSingleGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";

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
      <div>SingleGroupPage</div>
      <ul>
        <h2>{name}</h2>
        <img src={previewImage} alt='preview' ></img>
        <li>{about}</li>
        <li>{type}</li>
        <li>{city}</li>
        <li>{state}</li>
        <li>{organizerId}</li>
      </ul>
      {organizerBool && (
        <>
          <NavLink to={`/groups/${groupId}/edit`}>Edit</NavLink>
          <button onClick={handleDelete}>Delete</button>
          <NavLink to={`/groups/${groupId}/events/new`}>Create An Event</NavLink>
        </>
      )}
    </>
  )
}



export default SingleGroupPage;
