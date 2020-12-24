import React, { useState, useContext } from 'react';
import Loading from './Loading';
import FileUpload from './FileUpload';
import {
  attachmentsRef,
  timeStamp,
  messagesCollection,
  fsArrayUnion,
} from '../../firestore/index';
import { Button } from 'react-bootstrap';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { createRandomString } from '../../functions/CreateRandomString';
import { TextField, TextareaAutosize } from '@material-ui/core';
import $ from 'jquery';
import styles from './Comment.module.scss';

const Comment = ({ newThread, fieldName, m }) => {
  const setLoginPopup = useContext(LoginContext);
  const thisUser = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [attachedImages, setAttachedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const replyToID = m.id;

  const onFileUpload = async (image, uploadedBy) => {
    //image upload
    $('#uploadButton').hide();
    $('#progressCircle').show();
    const randomString = createRandomString(8);
    const metadata = {
      customMetadata: {
        uploadedBy: uploadedBy,
      },
    };
    const uploadTask = attachmentsRef
      .child(`${randomString}${image.name}`)
      .put(image, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //gives progress info on upload
        const transferProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(transferProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        //when complete
        uploadTask.snapshot.ref.getDownloadURL().then((gotURL) => {
          setAttachedImages([...attachedImages, gotURL]);
        });
        console.log('Upload Complete');
      }
    );
  };

  const sendComment = async (event) => {
    event.preventDefault();
    const newID = createRandomString(20).concat('xxxxxxx');
    const ahora = new Date();
    const now = timeStamp.fromDate(ahora);
    const authorRef = thisUser.ref;
    const messageArray = message.split('\n');
    let comment = {
      attachedImages,
      authorRef: authorRef,
      createdAt: now,
      id: newID,
      message: messageArray,
    };
    if (newThread) {
      //if starting a new thread
      comment['category'] = 'General';
      comment['title'] = title;
      comment['newThread'] = true;
      comment['updatedAt'] = now;
      comment['responses'] = [];
      try {
        messagesCollection.doc(newID).set({ ...comment });
      } catch (error) {
        console.log(error);
      }
    } else {
      //add a comment/reply to an existing post
      try {
        messagesCollection.doc(`${replyToID}`).update({
          responses: fsArrayUnion({ ...comment }),
          updatedAt: now,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <form onSubmit={(e) => sendComment(e)} className={styles.commentForm}>
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
              className={styles.textBox}
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
              className={styles.textBox}
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
            <FileUpload
              newThread={newThread}
              onFileUpload={onFileUpload}
              progress={progress}
            />
            <Button type="submit">POST</Button>
          </div>
        </div>
        {attachedImages.length > 0
          ? attachedImages.map((i) => {
              return (
                <img key={i} src={i} alt="" className={styles.commentImage} />
              );
            })
          : null}
      </form>
    </>
  );
};

export default Comment;
