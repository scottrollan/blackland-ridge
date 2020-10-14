import React, { useState, useEffect } from 'react';
import Loading from './shared/Loading';
import FileUpload from './shared/FileUpload';
import { Button, Spinner } from 'react-bootstrap';
import { UserContext } from '../App';
import { LoginContext } from '../App';
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
  const [showLogin, setShowLogin] = React.useContext(LoginContext);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); //image file
  const [newImageID, setNewImageID] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null); //url
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const myImageAsset = thisUser.image;
  const myImage = urlFor(myImageAsset);
  const messageTitle = m.title;
  let messageID = m._id; //id of newThread (original) message being replied to (or created)

  const onFileUpload = async (file) => {
    //image upload
    $('#uploadButton').html(<Spinner animation="border" variant="light" />);
    setSelectedFile(file);
    const response = await Client.assets.upload('image', file);
    setUploadedImage(response.url);
    setNewImageID(response._id);
    console.log(message);
  };

  const sendComment = async (event) => {
    event.preventDefault();
    $('#loading').css('display', 'flex');
    const inputTitle = title === '' ? `reply to ${messageTitle}` : title; // if reply, no original title
    let textArray = [];
    textArray = message.split('\n'); //split message text into paragraphs
    setUploadedImage(null);
    let thisMessage = '';
    thisMessage = prepareParagraphs(textArray);
    console.log('thisMessage', thisMessage);
    let newImage;

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
    if (newImageID) {
      //if there's a file attached, add it to post
      newImage = {
        _type: 'image',
        asset: {
          _ref: newImageID,
          _type: 'reference',
        },
      };
      post['image'] = newImage;
    }
    //send message to sanity
    let response;
    let responseID;
    try {
      response = await Client.create(post);
      console.log(response);
      responseID = response._id;
    } catch (error) {
      console.log('Create Failed: ', error.message);
    } finally {
      setTitle('');
      setMessage('');
      setUploadedImage(null);
    }
    //if not newThread, get new message _id and patch ref array of original message
    if (!newThread) {
      const refKey = createRandomString(32);
      const newRef = {
        //prepare a new reference for adding to the responses array within original message
        _key: refKey,
        _ref: responseID, //from create post above
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
  };

  return (
    <>
      <form
        onSubmit={(e) => sendComment(e)}
        className={styles.commentForm}
        id={id}
      >
        <Loading />
        <span
          style={{ display: thisUser ? 'none' : 'inherit' }}
          className={styles.setLogin}
          onClick={() => setShowLogin(true)}
        >
          <h5>Login to comment</h5>
          <i className="fal fa-comment-lines" style={{ fontSize: 48 }}></i>
        </span>
        <div
          className={styles.comment}
          style={{ display: thisUser ? 'inherit' : 'none' }}
        >
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
              id={`post${messageID}`}
              className={styles.textArea}
              label={fieldName}
              variant="outlined"
              position="start"
              edge="end"
              required
              style={{ height: 'auto' }}
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
            <FileUpload newThread={newThread} onFileUpload={onFileUpload} />
            <Button type="submit">POST</Button>
          </div>
        </div>
        <img
          src={uploadedImage ? uploadedImage : null}
          alt=""
          className={styles.commentImage}
        />
      </form>
    </>
  );
};

export default Comment;
