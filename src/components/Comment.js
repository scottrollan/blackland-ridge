import React from 'react';
import Loading from './shared/Loading';
import { Button } from 'react-bootstrap';
import { UserContext } from '../App';
import { createRandomString } from '../functions/CreateRandomString';
import { prepareParagraphs } from '../functions/PrepareParagraphs';
import { Client } from '../api/sanityClient';
import { TextField, TextareaAutosize } from '@material-ui/core';
import $ from 'jquery';
import styles from './Comment.module.scss';

const Comment = ({ m, newThread, fieldName, id }) => {
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const myImageAsset = thisUser.image;
  const messageTitle = m.title;
  let messageID = m._id; //id of newThread (original) message being replied to

  const sendComment = async (event) => {
    event.preventDefault();
    $('#loading').css('display', 'flex');
    const inputTitle =
      $('#newThreadTitle').val() === ''
        ? `reply to ${messageTitle}`
        : $('#newThreadTitle').val();
    const textArray = $(`#replyTo${messageID}`).val().split('\n');
    const thisMessage = prepareParagraphs(textArray);

    //prepare input message to send to sanity
    //if newThread, add inputTitle, if not add title as "reply to <messageTitle>"
    let post = {
      _type: 'message',
      author: me,
      avatar: myImageAsset,
      message: thisMessage,
      newThread: newThread,
      title: inputTitle,
    };
    //send message to sanity
    let response;
    let responseID;
    try {
      response = await Client.create(post);
      console.log(response);
      responseID = response._id;
    } catch (error) {
      console.log('Create Failed: ', error.message);
    }
    //if not newThread, get new message _id and patch ref array of original message
    if (!newThread) {
      const refKey = createRandomString(32);
      const newRef = {
        //prepare a new reference for adding to the responses array within original message
        _key: refKey,
        _ref: responseID,
        _type: 'reference',
      };
      let newRefArray = [];
      if (m.responses) {
        const oldRefArray = m.responses;
        newRefArray = [...oldRefArray, newRef];
      } else {
        newRefArray.push(newRef);
      }
      try {
        const res = await Client.patch(messageID)
          .set({ responses: newRefArray })
          .commit();
        console.log(res);
      } catch (error) {
        console.log('Patch failed: ', error.message);
      }
    }

    $('#newThreadTitle').val(''); //clear input fields
    $(`#replyTo${m._id}`).val('');
  };
  return (
    <form
      onSubmit={(e) => sendComment(e)}
      className={styles.commentForm}
      id={id}
    >
      <Loading />

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TextField
          id="newThreadTitle"
          label="Title"
          variant="outlined"
          position="start"
          edge="end"
          required={newThread ? true : false}
          style={{
            display: newThread ? 'inherit' : 'none',
          }}
        ></TextField>
        <TextareaAutosize
          id={`replyTo${m._id}`}
          label={fieldName}
          variant="outlined"
          position="start"
          className={styles.textArea}
          edge="end"
          required
          placeholder="Message *"
        ></TextareaAutosize>
        <Button type="submit">POST</Button>
      </div>
    </form>
  );
};

export default Comment;
