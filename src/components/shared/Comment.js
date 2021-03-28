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
import { sendUrgentAlert } from '../../functions/SendUrgentAlert';
import { createRandomString } from '../../functions/CreateRandomString';
import { Form } from 'react-bootstrap';
import $ from 'jquery';
import styles from './Comment.module.scss';

const Comment = ({
  newThread,
  fieldName,
  m,
  formID,
  titleID,
  messageTypeID,
}) => {
  const setLoginPopup = useContext(LoginContext);
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const myEmail = thisUser.email;
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState({});
  const [attachedImages, setAttachedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [messageType, setMessageType] = useState('General');
  const [authorID, setAuthorID] = useState();

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
  const handleSelect = (e) => {
    setMessageType(e);
  };

  const nowDate = new Date();
  const now = timeStamp.fromDate(nowDate);
  const dayOne = new Date('1970-01-01');
  const wayBack = timeStamp.fromDate(dayOne);
  const lastNotificationSent = m.lastResponseNotification ?? wayBack;
  const lastNotificationDate = lastNotificationSent.toDate();

  const responseNotification = (comment) => {
    //runs only if more than a day since last message notification && notifyAuthor = true && author hasn't received a notification in the last day
    console.log(
      `Triggering response notification and Updating last notification and update timestamps on message document ${m.id}`
    );
    try {
      //adds a doc to responseTriggers
      responseTriggers.doc().set({ ...response, title: m.title });
      profilesCollection.doc(authorID).update({ lastNotified: now });
      //update message with reply and new timestamps
      messagesCollection.doc(`${m.id}`).update({
        responses: fsArrayUnion({ ...comment }),
        updatedAt: now,
        lastResponseNotification: now,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateWithoutNotification = (comment) => {
    console.log(
      `Updating timestamp for "updatedAt" on message document ${m.id}`
    );
    try {
      //update message with reply and new updatedAt timestamp
      messagesCollection.doc(`${m.id}`).update({
        responses: fsArrayUnion({ ...comment }),
        updatedAt: now,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sendComment = async (event) => {
    event.preventDefault();
    const newID = createRandomString(20);
    const authorRef = thisUser.ref;
    const messageArray = message.split('\n');

    let comment = {
      attachedImages,
      authorEmail: myEmail,
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
      //IF COMMENT IS A RESPONSE TO A NEW THREAD//
      if (nowDate - lastNotificationDate > 86400000) {
        //last notification was over a day ago
        try {
          //get author info
          profilesCollection
            .doc(authorID)
            .get()
            .then((doc) => {
              const data = { ...doc.data() };
              if (doc.exists) {
                console.log('Profile found!');
                const authorNotifications = data.receiveNotifications;
                const lastNotificationSent = data.lastNotified ?? wayBack;
                if (
                  authorNotifications &&
                  nowDate - lastNotificationSent.toDate() > 86400000
                ) {
                  // if author receives notifications AND more than a day since last notification
                  //then send response trigger to cloud functions
                  responseNotification(comment);
                } else {
                  updateWithoutNotification(comment);
                }
              } else {
                console.log('Profile not found.');
              }
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        updateWithoutNotification(comment);
      }
    }
    // if (messageType === 'Urgent') {
    //   const urgentData = { me, message, title };
    //   sendUrgentAlert(urgentData);
    // }
    //resert form and state
    setTitle('');
    setMessage('');
    setAttachedImages('');
    setMessage('');
    $(`#${formID}`)[0].reset();
  };

  const setMessageData = (str) => {
    setMessage(str);
    let snippet = str.substr(0, 76);
    setResponse({
      responder: me,
      authorEmail: myEmail,
      snippet: snippet,
      title: title,
    });
  };

  if (newThread) {
    $(`#${messageTypeID}`).attr('required');
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
        id={formID}
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
            <Form.Group controlId={titleID}>
              <Form.Control
                type="text"
                placeholder="Title *"
                required={newThread ? true : false}
                style={{
                  display: newThread ? 'inherit' : 'none',
                }}
                value={title}
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
        <div
          style={{
            display: thisUser ? 'flex' : 'none',
            width: '100%',
          }}
        >
          <InputGroup className="mb-3" style={{ justifyContent: 'center' }}>
            <DropdownButton
              variant="outline-secondary"
              title={messageType}
              id={messageTypeID}
              style={{
                display: newThread ? 'inherit' : 'none',
              }}
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="General">General</Dropdown.Item>
              <Dropdown.Item eventKey="Items">Items for Sale</Dropdown.Item>
              <Dropdown.Item eventKey="News">Neighborhood News</Dropdown.Item>
              <Dropdown.Item
                disabled
                style={{ textDecoration: 'line-through' }}
              >
                Controversial Topics
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Item eventKey="Urgent" style={{ color: 'red' }}>
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
