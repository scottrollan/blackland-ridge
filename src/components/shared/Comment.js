import React, { useState, useContext, useEffect } from 'react';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Loading from './Loading';
import FileUpload from './FileUpload';
import RichTextInput from '../RichTextInput';
import { attachmentsRef, timeStamp } from '../../firestore/index';
import { Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { UserContext } from '../../App';
import { LoginContext } from '../../App';
import { sendComment } from '../../functions/SendComment';
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
  const [plainTextMessage, setPlainTextMessage] = useState('');
  const [responseTriggerInfo, setResponseTriggerInfo] = useState({});
  const [attachedImages, setAttachedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [messageType, setMessageType] = useState('General');
  const [messageID, setMessageID] = useState('');
  const [authorID, setAuthorID] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    const content = newState.getCurrentContent();
    const htmlStr = draftToHtml(convertToRaw(content));
    setMessage(htmlStr);
    const textStr = content.getPlainText();
    setPlainTextMessage(textStr);
    setResponseTriggerInfo({
      authorEmail: m.authorEmail,
      responder: me,
      responderEmail: myEmail,
      message: htmlStr,
      plainText: textStr,
      title: m.title,
    });
  };

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

  const dayOne = new Date('1970-01-01');
  const wayBack = timeStamp.fromDate(dayOne);
  const lastNotificationSent = m.lastResponseNotification ?? wayBack;
  const lastNotificationDate = lastNotificationSent.toDate();

  /////////////////////////////////////
  ////// ONSUBMIT OF COMMENT FORM /////
  const commentSubmission = (event) => {
    event.preventDefault();
    sendComment(
      thisUser,
      attachedImages,
      message,
      plainTextMessage,
      messageType,
      newThread,
      title,
      lastNotificationDate,
      responseTriggerInfo,
      authorID,
      messageID
    );
    //reset form and state
    setTitle('');
    setMessage('');
    setPlainTextMessage('');
    setAttachedImages('');
    setMessage('');
    const clearState = EditorState.push(
      editorState,
      ContentState.createFromText('')
    );
    setEditorState(clearState);
    $(`#${formID}`)[0].reset();
  };

  if (newThread) {
    $(`#${messageTypeID}`).attr('required');
  }

  useEffect(() => {
    const authorRef = m.authorRef ?? 'x';
    setAuthorID(authorRef.id);
    const mID = m.id;
    setMessageID(mID);
  }, [m]);

  return (
    <>
      <Form
        onSubmit={(e) => commentSubmission(e)}
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
              <RichTextInput
                onEditorStateChange={onEditorStateChange}
                editorState={editorState}
                placeholder={fieldName}
              />
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
            <Button variant="primary" type="submit">
              POST
            </Button>
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
