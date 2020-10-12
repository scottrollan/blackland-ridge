import React, { useState } from 'react';
import Loading from './shared/Loading';
import { Button } from 'react-bootstrap';
import { UserContext } from '../App';
import { createRandomString } from '../functions/CreateRandomString';
import { prepareParagraphs } from '../functions/PrepareParagraphs';
import { Client } from '../api/sanityClient';
import { TextField, TextareaAutosize } from '@material-ui/core';
import imageUrlBuilder from '@sanity/image-url';
import $ from 'jquery';
import styles from './Comment.module.scss';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};

const Comment = ({ m, newThread, fieldName, id }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const myImageAsset = thisUser.image;
  const myImage = urlFor(myImageAsset);
  const messageTitle = m.title;
  let messageID = m._id; //id of newThread (original) message being replied to (or created)

  const sendComment = async (event) => {
    event.preventDefault();
    $('#loading').css('display', 'flex');
    const inputTitle = title === '' ? `reply to ${messageTitle}` : title; // if reply, no original title
    const textArray = message.split('\n'); //split message text into paragraphs
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

    setTitle(''); //clear input fields
    setMessage('');
  };
  return (
    <form
      onSubmit={(e) => sendComment(e)}
      className={styles.commentForm}
      id={id}
    >
      <Loading />

      <div className={styles.comment}>
        <img src={myImage} alt="" className={styles.avatar} />
        <div className={styles.inputDiv}>
          <TextField
            id={`title${messageID}`}
            label="Title"
            variant="outlined"
            position="start"
            edge="end"
            required={newThread ? true : false}
            style={{
              display: newThread ? 'inherit' : 'none',
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></TextField>
          <TextareaAutosize
            id={`post${m._id}`}
            className={styles.textArea}
            label={fieldName}
            variant="outlined"
            position="start"
            edge="end"
            required
            placeholder={`${fieldName} *`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></TextareaAutosize>
        </div>
        <div
          className={styles.iconDiv}
          style={{
            flexDirection: !newThread ? 'row' : null,
            paddingTop: newThread ? '1rem' : '0',
          }}
        >
          <i className={`fal fa-camera-alt ${styles.icon}`}></i>
          <Button
            type="submit"
            style={{ margin: newThread ? '0  0 0.5rem 0' : 'inherit' }}
          >
            POST
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Comment;
