import React from 'react';
import Loading from './shared/Loading';
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
  const query = "*[_type == 'message'] | order(_updatedAt desc)";
  // const params = {ownerId: 'myUserId'}

  const subscription = Client.listen(query).subscribe((update) => {
    const comment = update.result;
    console.log(
      `Someone just replied to ${comment.author}'s post: "${comment.title}"`
    );
  });

  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const myImageAsset = thisUser.image;
  const myPic = urlFor(myImageAsset);
  const messageID = m._id;

  const sendComment = async (event, id) => {
    event.preventDefault();
    $('#loading').css('display', 'flex');
    const commentContent = $(`#replyTo${id}`).val();
    const originalMessage = { ...m };
    let refID;
    const myComment = {
      _type: 'message',
      title: `reply to ${id}`,
      message: commentContent,
      author: me,
      avatar: myImageAsset,
    };
    try {
      const response = await Client.create(myComment);
      console.log(response);
      let randomStr = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 32; i++) {
        randomStr += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      refID = response._id;
      const newMessageRef = {
        _key: randomStr,
        _ref: refID,
        _type: 'reference',
      };
      if (originalMessage.responses) {
        originalMessage.responses = [
          ...originalMessage.responses,
          newMessageRef,
        ];
      } else if (!originalMessage.responses) {
        originalMessage['responses'] = [newMessageRef];
      }
      const response2 = await Client.patch(id).set(originalMessage).commit();
      console.log(response2);
    } catch (error) {
      console.log('Create Failed: ', error.message);
    }
    $(`#replyTo${id}`).val('');
    $('#loading').css('display', 'none');
  };

  return (
    <form
      onSubmit={(e) => sendComment(e, messageID)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      <Loading />
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
