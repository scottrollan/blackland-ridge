import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import {
  timeStamp,
  chatsCollection,
  fsArrayUnion,
} from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import { Modal, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import $ from 'jquery';
import styles from './OpenMessage.module.scss';

const OpenMessage = ({ message, handleMessageClose, show }) => {
  const thisUser = useContext(UserContext);
  const me = thisUser.displayName;
  const myID = thisUser.id;
  const messageID = message.id ?? 'xyz';
  const myPhotoURL = thisUser.photoURL;
  const [chatterNames, setChatterNames] = useState([]);
  const [chatterPhotoURLs, setChatterPhotoURLs] = useState([]);
  const [chatterIDs, setChatterIDs] = useState([]);
  const [chats, setChats] = useState([]);
  const [replyText, setReplyText] = useState('');

  // const uniqBy = require('lodash/uniqby');
  const remove = require('lodash/remove');

  const openModal = () => {
    document
      .getElementById('endOfMessages')
      .scrollIntoView({ behavior: 'smooth' });
    //remove me from unread list
    let uList = [...message.unread];
    if (uList.includes(myID)) {
      uList = remove(uList, (c) => {
        // exclude me
        return c !== myID;
      });
      chatsCollection.doc(messageID).update({
        unread: uList,
      });
    }
  };

  const sendNewReply = (e) => {
    e.preventDefault();
    const n = new Date();
    const now = timeStamp.fromDate(n);
    const textArray = replyText.split('\n');
    //prepare replyObj to send to firestore
    const replyObj = {
      date: now,
      id: myID,
      name: me,
      paragraphs: [...textArray],
      photoURL: myPhotoURL,
    };
    //add all recipients (not me) to unread array
    let unreadList = [...chatterIDs];
    unreadList = remove(unreadList, (u) => {
      return u !== myID;
    });
    //send reply and updated "unread" array to firestore
    chatsCollection.doc(messageID).update({
      messages: fsArrayUnion({ ...replyObj }),
      unread: unreadList,
      updatedAt: now,
    });
    setReplyText('');
    $('#replyForm')[0].reset();
  };

  useEffect(() => {
    let theseChatters = message.theseChatters ?? [];
    let cNames = [];
    let cIDs = [];
    let cPhotoURLs = [];
    let cChats = message.messages ?? [];
    theseChatters.forEach((chatter) => {
      cNames = [
        ...cNames,
        { name: chatter.chatterName, displayName: chatter.chatterDisplayName },
      ];
      cPhotoURLs = [...cPhotoURLs, chatter.chatterPhotoURL];
      cIDs = [...cIDs, chatter.chatterID];
    });
    // cNames = uniqBy(cNames, chatterName);
    // cPhotoURLs = uniq(cPhotoURLs);
    // cIDs = uniq(cIDs);
    setChatterNames([...cNames]);
    setChatterPhotoURLs([...cPhotoURLs]);
    setChatterIDs([...cIDs]);
    setChats([...cChats]);
    //listen for changes
    chatsCollection.doc(messageID).onSnapshot((doc) => {
      if (doc.exists) {
        const newData = doc.data();
        const newChatsArray = newData.messages;
        setChats([...newChatsArray]);
      }
    });
  }, [message, messageID]);

  return (
    <Modal
      show={show}
      onHide={() => handleMessageClose(messageID)}
      scrollable
      onEntered={() => openModal()}
    >
      <Modal.Header
        style={{
          width: '100%',
          padding: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Modal.Title
          as="h5"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {chatterPhotoURLs.map((p, uI) => (
            <span
              className={styles.imageWrapper}
              key={p}
              style={{ display: uI > 1 ? 'none' : 'initial' }}
            >
              <img
                src={p}
                alt=""
                className={styles.chatterImage}
                style={{
                  marginTop: chatterPhotoURLs.length === 1 ? 0 : `${1 - uI}rem`,
                  '--photoSize':
                    chatterPhotoURLs.length > 1 ? '1.75rem' : '3rem',
                  marginLeft: uI > 0 ? '-1.5rem' : 0,
                  zIndex: uI < 1 ? 11 : 9,
                }}
              />
            </span>
          ))}
          {chatterNames.map((n, i) => (
            <span
              key={`${n.name.split(' ').join('')}${i}`}
              style={{ display: i < 2 ? 'inline-block' : 'none' }}
            >
              <span style={{ display: i > 0 ? 'inline-block' : 'none' }}>
                , &nbsp;
              </span>
              {n.displayName}
            </span>
          ))}
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip id={createRandomString(4)}>
                {chatterNames.map((n, i) => (
                  <div
                    key={n.name}
                    style={{ display: i < 2 ? 'none' : 'block' }}
                  >
                    {n.displayName}
                  </div>
                ))}
              </Tooltip>
            }
          >
            <span
              style={{
                backgroundColor: 'var(--color-pallette-light)',
                borderRadius: '0.2rem',
                fontSize: 'small',
                padding: '0.25rem',
                margin: '0 0.25rem',
                cursor: 'help',
                display: chatterNames.length > 2 ? 'inline-block' : 'none',
              }}
            >
              +&nbsp;{chatterNames.length - 2}&nbsp;more
            </span>
          </OverlayTrigger>
        </Modal.Title>
        <button
          type="button"
          onClick={() => handleMessageClose()}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
          }}
        >
          <span>
            <i className="fas fa-long-arrow-left"></i>
          </span>
        </button>
      </Modal.Header>
      <Modal.Body>
        {chats.map((c, index) => {
          let lastIndex = chats.length - 1;
          let paragraphs = c.paragraphs;
          let key = `${c.id}${index}`;

          return (
            <div
              key={key}
              style={{
                display: 'flex',
                flexDirection: c.id === myID ? 'row-reverse' : 'row',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              <div
                className={styles.speechHead}
                style={{ '--photoURL': `url(${c.photoURL})` }}
              ></div>
              <div
                id={index === lastIndex ? 'endOfMessages' : null}
                className={[
                  `${styles.speechBubble} ${
                    c.id === myID ? styles.myBubble : styles.notMyBubble
                  }`,
                ]}
              >
                {paragraphs.map((p) => {
                  const rs = createRandomString(6);
                  return <p key={rs}>{p}</p>;
                })}
              </div>
            </div>
          );
        })}
        {/* <div id="endOfMessages">.</div> */}
      </Modal.Body>
      <Modal.Footer>
        <Form onSubmit={sendNewReply} className={styles.form} id="replyForm">
          <Form.Group controlId="myReply">
            <Form.Control
              as="textarea"
              placeholder="reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className={styles.replyButton}>
            Send
          </Button>
        </Form>
      </Modal.Footer>
    </Modal>
  );
};

export default OpenMessage;
