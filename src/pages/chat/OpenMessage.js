import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { createRandomString } from '../../functions/CreateRandomString';
import { Modal } from 'react-bootstrap';
import styles from './OpenMessage.module.scss';

const OpenMessage = ({ message, handleMessageClose, show }) => {
  const thisUser = useContext(UserContext);
  const me = thisUser.displayName;
  const myID = thisUser.id;
  const [chatterNames, setChatterNames] = useState([]);
  const [chatterPhotoURLs, setChatterPhotoURLs] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    let chatters = message.chatters ?? [];
    let cNames = [];
    let cPhotoURLs = [];
    let cChats = message.messages ?? [];
    chatters.forEach((chatter) => {
      cNames = [...cNames, chatter.chatterName];
      cPhotoURLs = [...cPhotoURLs, chatter.chatterPhotoURL];
    });
    setChatterNames([...cNames]);
    setChatterPhotoURLs([...cPhotoURLs]);
    setChats([...cChats]);
  }, [message]);

  return (
    <Modal show={show} onHide={handleMessageClose}>
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
            <span className={styles.imageWrapper} key={p}>
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
            <span key={`${n.split(' ').join('')}${i}`}>
              <span style={{ display: i > 0 ? 'inline-block' : 'none' }}>
                , &nbsp;
              </span>
              {n}
            </span>
          ))}
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
                style={{ '--photoURL': `url(${c.photoURL}` }}
              ></div>
              <div
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
              <div className={styles.bubbleBumper}></div>
            </div>
          );
        })}
      </Modal.Body>
    </Modal>
  );
};

export default OpenMessage;
