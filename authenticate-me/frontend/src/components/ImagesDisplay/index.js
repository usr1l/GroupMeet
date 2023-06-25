import React, { useEffect, useRef, useState } from 'react';
import './ImagesDisplay.css';
import ImagePreview from '../ImagePreview';
import IconDescriptionCard from '../IconDescriptionCard';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { csrfFetch } from '../../store/csrf';
import { actionDeleteGroupImage } from '../../store/groups';

const ImagesDisplay = ({ img, organizerBool = false }) => {
  const [ editDivBool, setEditDivBool ] = useState(false);
  const ulRef = useRef();
  const dispatch = useDispatch();

  const group = useSelector(state => state.groups.group);

  function getDisplayDate(isoDateString) {
    // Parse the ISO date string into a Date object
    const date = new Date(isoDateString);

    // Array to map month number to month name
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    // Format the Date object into desired format
    const formattedDate = months[ date.getUTCMonth() ] + ' ' +
      date.getUTCDate() + ', ' +
      date.getUTCFullYear() + ' ' +
      date.getUTCHours() + ':' +
      String(date.getUTCMinutes()).padStart(2, '0') + ':' +
      String(date.getUTCSeconds()).padStart(2, '0');

    return formattedDate;
  }

  const thunkDeleteGroupImage = (imageId) => async dispatch => {
    const response = await csrfFetch(`/api/group-images/${imageId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    if (response.ok) {
      dispatch(actionDeleteGroupImage(imageId));
    };

    return response;
  };

  useEffect(() => {
    if (!editDivBool) return;

    const closeMenu = (e) => {
      if (ulRef.current) {
        if (!ulRef.current.contains(e.target)) {
          setEditDivBool(false);
        };
      };
      return;
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [ editDivBool ]);

  const closeMenu = () => setEditDivBool(false);

  return (
    <div style={{
      "width": "1000px",
      "height": "660px",
      "display": "flex",
      "boxSizing": "border-box",
      "backgroundColor": "white"
    }}>
      <div style={{
        "maxHeight": "100%",
        "maxWidth": "50%",
        "height": "auto",
        "width": "auto",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "backgroundColor": "black",
        "boxSizing": "border-box"
      }}  >
        <img
          src={img.url}
          style={{
            "maxHeight": "100%",
            "maxWidth": "100%",
            "boxSizing": "border-box"
          }}
        />
      </div>
      <div style={{
        "width": "50%",
        "height": "100%",
        "boxSizing": "border-box",
        "display": "flex",
        "flexDirection": "column"
      }}>
        <div style={{
          "display": "flex",
          "width": "100%",
          "justifyContent": "space-between"
        }}>
          <IconDescriptionCard
            cardStyle='group-page-oragnizer-element'
            heading={group.name}
            subHeading={getDisplayDate(img.createdAt)}
            previewBool={true}
            previewSrc={group.previewImage}
          />
          {organizerBool && !img.preview && (
            <div
              ref={ulRef}
              onClick={() => setEditDivBool(true)}
              style={{
                "boxSizing": "border-box",
                "padding": "20px",
                "cursor": "pointer"
              }}>. . .
              {editDivBool && (
                <div
                  ref={ulRef}
                  style={{
                    "position": "absolute",
                    "height": "100px",
                    "width": "100px",
                    "boxShadow": "-1px 1px 3px 0.4px #888888",
                    "right": "20px",
                    "top": "50px",
                    "display": "flex",
                    "flexDirection": "column",
                    "boxSizing": "border-box",
                    "padding": "10px",
                    "alignContent": "flex-end",
                    "cursor": 'default'
                  }}
                >
                  <OpenModalMenuItem
                    itemText="Delete"
                    onItemClick={closeMenu}
                    modalComponent={<ConfirmDeleteModal deleteId={img.id} deleteFn={thunkDeleteGroupImage} directTo={`/groups/${img.groupId}/images`} />}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div >
  )
};

export default ImagesDisplay;
