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
import { Form } from 'react-bootstrap';
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

  const onFileUpload = async (image, newMetadata) => {
    //image upload
    $('#uploadButton').hide();
    $('#progressCircle').show();
    const randomString = createRandomString(8);
    const metadata = {
      customMetadata: newMetadata,
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
    const newID = createRandomString(20);
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
    setTitle('');
    setMessage('');
    setAttachedImages('');
    $('#commentForm')[0].reset();
  };

  return (
    <>
      <Form
        onSubmit={(e) => sendComment(e)}
        className={styles.commentForm}
        id="commentForm"
      >
        <Loading />
        <span
          style={{ display: thisUser ? 'none' : 'inherit' }}
          className={styles.setLogin}
          onClick={() => setLoginPopup.showLoginPopup()}
        >
          <h5>Login to Engage Neighbors</h5>
          <i className="fal fa-comment-lines" style={{ fontSize: 48 }}></i>
        </span>
        <div
          className={styles.comment}
          style={{ display: thisUser ? 'inherit' : 'none' }}
        >
          <div className={styles.inputDiv}>
            <Form.Group controlId="title">
              <Form.Control
                type="text"
                placeholder="Title *"
                required={newThread ? true : false}
                style={{
                  display: newThread ? 'inherit' : 'none',
                }}
                value={title}
                // id="title"
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                required
                placeholder={fieldName}
                value={message}
                // id="message"
                onChange={(e) => setMessage(e.target.value)}
              ></Form.Control>
            </Form.Group>
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
              metadata={null}
              requireForm={false}
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
      </Form>
    </>
  );
};

export default Comment;
