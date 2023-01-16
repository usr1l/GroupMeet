import React from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { actionDeleteBooks } from '../store/bookReducer';


const EventIndexItem = ({ book }) => {

  // const dispatch = useDispatch();

  // const deleteBook = (e) => {
  //   e.preventDefault();
  //   dispatch(actionDeleteBooks(book.id));
  // };

  return (
    <li>
      Indexed Item
      {/* <Link to={`/books/${book.id}`}>Book #{book.id}</Link>
      <Link to={`/books/${book.id}/edit`}>Edit</Link>
      <button onClick={deleteBook}>Delete</button> */}
    </li>
  );
};

export default EventIndexItem;
