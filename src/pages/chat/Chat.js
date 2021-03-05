import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { chatsCollection } from '../../firestore/index';
// import { useQuery } from 'react-query';
import { createRandomString } from '../../functions/CreateRandomString';
import { parseTimeLapsed } from '../../functions/ParseTimeLapsed';
import { Modal, Spinner } from 'react-bootstrap';
import styles from './Chat.module.scss';
const uniq = require('lodash/uniq');
const uniqBy = require('lodash/uniqBy');
const remove = require('lodash/remove');

// LIST OF ALL CHATS, NEWEST ON TOP //

export default function Chat({ handleClose, handleMessageShow, show }) {
  const thisUser = useContext(UserContext);
  const me = thisUser.displayName;
  const myID = thisUser.id;
  const [myChats, setMyChats] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const messageOpen = (m) => {
    handleClose();
    handleMessageShow(m);
  };
  useEffect(() => {
    let mounted = true;
    let chats = [];
    try {
      chatsCollection
        .where('chatters', 'array-contains', `${myID}`)
        .orderBy('updatedAt', 'desc')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            let changeData = { ...change.doc.data(), id: change.doc.id };
            chats = [...chats, changeData];
            // chats = uniqBy(chats, 'id');
            setMyChats([...chats]);
            if (change.type === 'modified') {
              console.log('Chat modified.');
            }

            console.log(chats);
            chats.forEach((chat, index) => {
              let mess = chat.messages ?? [];
              //create lastComment string
              let lastCommentObj = { ...mess[mess.length - 1] };
              const by = lastCommentObj.name;
              const sent = lastCommentObj.date.toDate();
              const today = new Date();
              const timeLapsed = today - sent;
              const time = parseTimeLapsed(timeLapsed);
              const quote = lastCommentObj.paragraphs[0];

              let lastComment = {
                comment: me ? `You: ${quote}` : `${by}: ${quote}`,
                date: time,
              };
              //create chatter array, excluding me
              let chatters = [];
              let chatterObj = {};
              mess.forEach((m) => {
                chatterObj = {
                  chatterName: m.name,
                  chatterPhotoURL: m.photoURL,
                  chatterID: m.id,
                };
                chatters = [...chatters, chatterObj];
              });
              chatters = uniq(chatters);
              chatters = remove(chatters, (c) => {
                // exclude me
                return c.chatterID !== myID;
              });
              chats[index] = { ...chat, chatters, lastComment, me }; //add chatters array & lastComment to current index
            });
            // chats = uniqBy(chats, 'id');

            if (mounted) {
              setMyChats([...chats]);
            }
            setIsFetching(false);
          });
        });
    } catch (e) {
      console.log(e);
    }
    const unsubscribe = chatsCollection.onSnapshot(function () {});

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [myID]);

  return (
    <Modal
      id="chat"
      className={styles.chatModal}
      show={show}
      onHide={handleClose}
    >
      <div
        style={{
          width: '100%',
          display: isFetching ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '4rem',
        }}
      >
        <Spinner
          animation="grow"
          style={{
            color: 'var(--color-pallette-muted-accent)',
          }}
        />
      </div>
      <Modal.Header
        className="chatListItem"
        closeButton
        style={{
          display: isFetching ? 'none' : 'flex',
        }}
      >
        <Modal.Title id="modalTitle">{me}'s Messages</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: isFetching ? 'none' : 'flex',
          flexDirection: 'column',
        }}
      >
        {myChats.map((c, index) => {
          let chatters = c.chatters;
          let chatterNames = [];
          let lastComment = c.lastComment ?? { comment: '', date: null };
          let chatterPhotoURLs = [];
          chatters.forEach((chatter) => {
            chatterNames = [...chatterNames, chatter.chatterName];
            chatterPhotoURLs = [...chatterPhotoURLs, chatter.chatterPhotoURL];
          });
          return (
            <div
              key={`${index}${createRandomString(5)}`}
              className={[`${styles.chat} chatListItem`]}
              id={`chatListItem${c.id}`}
              onClick={() => messageOpen(c)}
            >
              <div className={[`${styles.imageWrapper} chatListItem`]}>
                {chatterPhotoURLs.map((u, uI) => (
                  <img
                    key={`${u}${uI}`}
                    src={u}
                    alt="NOPE!"
                    className={styles.chatterImage}
                    style={{
                      marginTop:
                        chatterPhotoURLs.length === 1 ? 0 : `${1 - uI}rem`,
                      '--photoSize':
                        chatterPhotoURLs.length > 1 ? '2.75rem' : '4rem',
                      marginLeft: uI > 0 ? '-1.25rem' : 0,
                      zIndex: uI < 1 ? 11 : 9,
                    }}
                  />
                ))}
              </div>
              <div className={[`${styles.wordsWrapper} chatListItem`]}>
                <div className={styles.chatterList}>
                  {chatterNames.map((n, cI) => (
                    <span
                      key={`${cI}${n}`}
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <span style={{ backgroundColor: 'transparent' }}>
                        {n}
                      </span>
                      <span
                        style={{
                          display:
                            chatterNames.length > cI + 1
                              ? 'inline-block'
                              : 'none',
                        }}
                      >
                        ,&nbsp;
                      </span>
                    </span>
                  ))}
                </div>
                <div className={styles.lastComment}>
                  <span className={styles.lastCommentComment}>
                    {lastComment.comment ?? ''}
                  </span>
                  <span className={styles.lastCommentDate}>
                    {lastComment.date ?? ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </Modal.Body>
    </Modal>
  );
}
