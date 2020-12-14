import React, { useState, useContext } from 'react';
import Loading from './Loading';
import FileUpload from './FileUpload';
import { Button, Spinner } from 'react-bootstrap';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { createRandomString } from '../../functions/CreateRandomString';
import { TextField, TextareaAutosize } from '@material-ui/core';
import $ from 'jquery';
import styles from './Comment.module.scss';

const Comment = ({ newThread, fieldName }) => {
  const setLoginPopup = useContext(LoginContext);
  const thisUser = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const setSelectedFile = useState(null); //image file
  const [newImageID, setNewImageID] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null); //url

  const onFileUpload = async (file) => {
    //image upload
    $('#uploadButton').html(<Spinner animation="border" variant="light" />);
    setSelectedFile(file);
    const response = '';
    setUploadedImage(response.url);
    setNewImageID(response._id);
    console.log(message);
  };

  const sendComment = async (event) => {};

  return (
    <>
      <form
        onSubmit={(e) => sendComment(e)}
        className={styles.commentForm}
        // id={}
      >
        <Loading />
        <span
          style={{ display: thisUser ? 'none' : 'inherit' }}
          className={styles.setLogin}
          onClick={() => setLoginPopup.showLoginPopup()}
        >
          <h5>Login to comment</h5>
          <i className="fal fa-comment-lines" style={{ fontSize: 48 }}></i>
        </span>
        <div
          className={styles.comment}
          style={{ display: thisUser ? 'inherit' : 'none' }}
        >
          {/* <img src={} alt="" className={styles.avatar} /> */}
          <div className={styles.inputDiv}>
            <TextField
              // id={`title${messageID}`}
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
              // id={`post${messageID}`}
              className={styles.textArea}
              label={fieldName}
              variant="outlined"
              position="start"
              edge="end"
              required
              style={{ height: 'auto' }}
              placeholder={fieldName}
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
