import React, { useState, useContext, useEffect } from 'react';
import Loading from './Loading';
import FileUpload from './FileUpload';
import {
  attachmentsRef,
  timeStamp,
  messagesCollection,
  fsArrayUnion,
  profilesCollection,
  responseTriggers,
} from '../../firestore/index';
import { Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { createRandomString } from '../../functions/CreateRandomString';
import { Form } from 'react-bootstrap';
import $ from 'jquery';
import styles from './Comment.module.scss';

const Comment = ({ newThread, fieldName, m }) => {
  const setLoginPopup = useContext(LoginContext);
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState({});
  const [attachedImages, setAttachedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [messageType, setMessageType] = useState('General');
  const [authorID, setAuthorID] = useState('');

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

  const ahora = new Date();
  const now = timeStamp.fromDate(ahora);
  const janOne = new Date('1970-01-01');
  const wayBack = timeStamp.fromDate(janOne);
  const lastSent = m.lastResponseNotification ?? wayBack;

  const responseNotification = (send) => {
    let receiveNotifications;
    let authorEmail;
    if (send) {
      //if more than a day since last notification
      profilesCollection
        .doc(authorID)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            receiveNotifications = await doc.data().receiveNotifications;
            authorEmail = await doc.data().email;
            if (receiveNotifications) {
              responseTriggers
                .doc()
                .set({ ...response, authorEmail: authorEmail });
            }
          } else {
            console.log("That user doesn't exist.");
          }
        });
    } else {
    }
  };

  const sendComment = async (event) => {
    event.preventDefault();
    const newID = createRandomString(20);
    const authorRef = thisUser.ref;
    const messageArray = message.split('\n');
    let comment = {
      attachedImages,
      authorRef: authorRef,
      createdAt: now,
      id: newID,
      message: messageArray,
      messageType: messageType,
      name: me,
    };
    if (newThread) {
      //if starting a new thread
      comment['category'] = messageType;
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
      //add a comment/reply to an existing post/ run responseNotification
      try {
        if (now.seconds - lastSent.seconds > 86400) {
          // if more than a day since last notification
          messagesCollection.doc(`${m.id}`).update({
            responses: fsArrayUnion({ ...comment }),
            updatedAt: now,
            lastResponseNotification: now, //add updated notification date
          });
          responseNotification(true); //and send notification
        } else {
          //otherwise, just update regular fields
          messagesCollection.doc(`${m.id}`).update({
            responses: fsArrayUnion({ ...comment }),
            updatedAt: now,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    setTitle('');
    setMessage('');
    setAttachedImages('');
    setMessage('');
    $('#commentForm')[0].reset();
  };

  const setMessageData = (str) => {
    setMessage(str);
    setResponse({ title: m.title, responder: me, snippet: str.substr(0, 76) });
  };

  if (newThread) {
    $('#messageType').attr('required');
  }
  useEffect(() => {
    const authorRef = m.authorRef ?? 'x';
    setAuthorID(authorRef.id);
  }, [m]);

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
                onChange={(e) => setMessageData(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </div>
          <div
            className={styles.iconDiv}
            style={{
              flexDirection: !newThread ? 'row' : null,
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
        <div>
          <InputGroup className="mb-3">
            <DropdownButton
              variant="outline-secondary"
              title="* Message Type"
              id="messageType"
              style={{
                display: newThread ? 'inherit' : 'none',
              }}
            >
              <Dropdown.Item
                value="General"
                onSelect={(e) => setMessageType(e.target.value)}
              >
                General
              </Dropdown.Item>
              <Dropdown.Item
                value="Items"
                onSelect={(e) => setMessageType(e.target.value)}
              >
                Items for Sale
              </Dropdown.Item>
              <Dropdown.Item
                value="News"
                onSelect={(e) => setMessageType(e.target.value)}
              >
                Neighborhood News
              </Dropdown.Item>
              <Dropdown.Item
                disabled
                style={{ textDecoration: 'line-through' }}
              >
                Controversial Topics
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Item
                value="Urgent"
                onSelect={(e) => setMessageType(e.target.value)}
                style={{ color: 'red' }}
              >
                URGENT ALERT!
              </Dropdown.Item>
            </DropdownButton>
          </InputGroup>
        </div>
      </Form>
    </>
  );
};

export default Comment;
