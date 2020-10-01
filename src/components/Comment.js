import React from 'react';
import Loading from './shared/Loading';
import { UserContext } from '../App';
import { Client } from '../api/sanityClient';
import { TextField } from '@material-ui/core';
import $ from 'jquery';
import imageUrlBuilder from '@sanity/image-url';
import styles from '../pages/Messages.module.scss';

const builder = imageUrlBuilder(Client);
const urlFor = (source) => {
  return builder.image(source);
};
export default Comment = ({ m, newThread, getMessages }) => {
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const myImageAsset = thisUser.image;
  const myPic = urlFor(myImageAsset);
  let messageID;
  if (!newThread) {
    messageID = m._id; //id of newThread (original) message being replied to
  }
  const sendComment = async (event) => {
    event.preventDefault();
    $('#loading').css('display', 'flex');
    const commentContent = $(`#replyTo${messageID}`).val(); //grab what was entered in input
    const originalMessage = { ...m }; //copy original message, including reponses ref array
    let refID;
    const myComment = {
      //prepare message to sanity database
      _type: 'message',
      title: newThread ? $('#newThreadTitle').val() : `reply to ${messageID}`, //if newThread, get title from input, else title is "reply to ....."
      message: commentContent,
      author: me,
      avatar: myImageAsset,
      newThread: newThread,
    };
    try {
      const response = await Client.create(myComment);
      console.log(response);
      if (!newThread) {
        //If it is not a NEW thread (if it's a reply)
        let randomStr = ''; //prepare a new element in the original thread's ref array
        const characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
          randomStr += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        refID = response._id; //returned from create above
        const newMessageRef = {
          //
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
        const response2 = await Client.patch(messageID)
          .set(originalMessage)
          .commit();
        return response2;
      }
    } catch (error) {
      console.log('Create Failed: ', error.message);
    } finally {
      $(`#replyTo${messageID}`).val('');
      getMessages();
      // document.getElementById(`${refID}`).scrollIntoView({
      //   behavior: 'smooth',
      // });
    }
  };
  return (
    <form
      onSubmit={(e) => sendComment(e)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Loading />

      <img
        src={myPic}
        alt=""
        style={{ borderRadius: '50%', alignSelf: 'center' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <TextField
          label="Title"
          variant="outlined"
          position="start"
          edge="end"
          required
          style={{
            display: newThread ? 'inherit' : 'none',
            margin: '0 0 1rem 0.5rem',
          }}
        ></TextField>
        <TextField
          id={m ? `replyTo${m._id}` : null}
          label="Reply"
          variant="outlined"
          position="start"
          edge="end"
          required
          style={{ marginLeft: '0.5rem' }}
        ></TextField>
      </div>
    </form>
  );
};
