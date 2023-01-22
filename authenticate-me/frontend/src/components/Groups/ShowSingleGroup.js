import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { thunkDeleteGroup, thunkLoadGroups } from "../../store/groups";
import { useHistory } from "react-router-dom";
import errorPageHandler from "../ErrorPage";

const SingleGroupPage = ({ groupData }) => {
  const history = useHistory();
  const { user } = useSelector(state => state.session);

  const groupState = useSelector(state => state.groups);
  const { groupId } = useParams();

  if (groupState.status === true) return (<div>Loading...</div>)

  const group = useSelector(state => state.groups.groups[ groupId ]);
  if (!group) return (<div>Not Found</div>);

  let { name, about, type, city, state, organizerId, previewImage } = group;

  const organizerBool = organizerId === user.id;
  // can still use group.private

  const dispatch = useDispatch();
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
        {console.log(previewImage)}
        <img src={previewImage} alt='group image' ></img>
        <li>{about}</li>
        <li>{type}</li>
        <li>{city}</li>
        <li>{state}</li>
        <li>{organizerId}</li>
      </ul>
      {organizerBool && (
        <>
          <Link to={`/groups/${groupId}/edit`}>Edit</Link>
          <button onClick={handleDelete}>Delete</button>
          <Link to={`/groups/${groupId}/events/new`}>Create An Event</Link>
        </>
      )}
    </>
  )
}



export default SingleGroupPage;
