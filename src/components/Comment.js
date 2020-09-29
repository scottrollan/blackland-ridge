import React from 'react';
import { UserContext } from '../App';
import { Client } from '../api/sanityClient';
import { TextField } from '@material-ui/core';
import $ from 'jquery';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};
export default Comment = ({ m }) => {
  const thisUser = React.useContext(UserContext);
  const myPic = urlFor(thisUser.image);
  const messageID = m._id;

  const sendComment = (id) => {
    console.log('ID: ', id, '    message: ', $(`#replyTo${id}`).val());
    alert('check console');
  };

  return (
    <form
      onSubmit={() => sendComment(messageID)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '85%',
        }}
      >
        <img
          src={myPic}
          alt=""
          style={{ borderRadius: '50%', alignSelf: 'center' }}
        />
        <TextField
          id={`replyTo${m._id}`}
          label="Reply"
          variant="outlined"
          position="start"
          edge="end"
          style={{ marginLeft: '0.5rem', flex: 1 }}
        ></TextField>
      </div>
    </form>
  );
};
