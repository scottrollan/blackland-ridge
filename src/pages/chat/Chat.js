import React, { useState, useContext, useEffect } from 'react';
import { UserContext, ProfilesContext } from '../../App';
import { chatsCollection } from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import { parseTimeLapsed } from '../../functions/ParseTimeLapsed';
import {
  Modal,
  Spinner,
  Button,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import $ from 'jquery';
import styles from './Chat.module.scss';

const uniqBy = require('lodash/uniqBy');
const remove = require('lodash/remove');

export default function Chat({
  handleClose,
  handleMessageShow,
  show,
  handleNewMessageShow,
}) {
  const allUsers = useContext(ProfilesContext);
  const thisUser = useContext(UserContext);
  const me = thisUser.displayName;
  const myID = thisUser.id;
  const [myChats, setMyChats] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const messageOpen = (m) => {
    handleClose();
    handleMessageShow(m);
  };

  const createNewMessage = () => {
    handleClose();
    handleNewMessageShow();
  };

  useEffect(() => {
    let mounted = true;
    try {
      let chats = [];
      chatsCollection
        .where('chatters', 'array-contains', `${myID}`)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            let changeID = change.doc.id;
            let changeData = { ...change.doc.data(), id: changeID };
            chats = [...chats, changeData];
            if (change.type === 'modified') {
              //if not initial fetch
              chats = remove(chats, (c) => {
                return c.id !== changeID; //remove pre-change data
              });
              chats = [...chats, changeData]; //replace with modified data
            }
          });
          chats.forEach((chat, index) => {
            let mess = chat.messages ?? [];
            //create lastComment string
            let lastCommentObj = { ...mess[mess.length - 1] };
            const by = lastCommentObj.name;
            const sent = lastCommentObj.date.toDate();
            const quote = lastCommentObj.paragraphs[0];

            let lastComment = {
              comment: by === me ? `You: ${quote}` : `${by}: ${quote}`,
              date: sent,
            };

            let theseChatters = [];
            const chatters = chat.chatters; //array of id's
            chatters.forEach((chatter) => {
              let thisChatter = allUsers.find(
                (profile) => profile.id === chatter
              );
              const chatterObj = {
                chatterID: thisChatter.id,
                chatterName: thisChatter.name,
                chatterDisplayName: thisChatter.displayName,
                chatterPhotoURL: thisChatter.photoURL,
              };
              theseChatters = [...theseChatters, { ...chatterObj }];
            });

            theseChatters = uniqBy(theseChatters, 'chatterID');
            theseChatters = remove(theseChatters, (c) => {
              // exclude me
              return c.chatterID !== myID;
            });
            chats[index] = { ...chat, theseChatters, lastComment, me }; //add theseChatters array & lastComment to current index
          });

          if (mounted) {
            chats = uniqBy(chats, 'id');
            chats.sort((a, b) => {
              return a.updatedAt > b.updatedAt ? -1 : 1;
            }); //puts most recently added on top
            setMyChats([...chats]);
          }
          setIsFetching(false);
        });
    } catch (e) {
      console.log(e);
    }
    const unsubscribe = chatsCollection.onSnapshot(() => {});

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [myID, me, allUsers]);

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
        <div style={{ display: myChats.length < 1 ? 'block' : 'none' }}>
          No Messages
        </div>

        {myChats.map((c, index) => {
          let chatters = c.theseChatters ?? [];
          let chatterNames = [];
          let lastComment = c.lastComment ?? { comment: '', date: null };
          let now = new Date();
          let timeLapsed = now - lastComment.date;
          let realTime = parseTimeLapsed(timeLapsed);
          let chatterPhotoURLs = [];
          let unreadArray = [...c.unread] ?? [];
          chatters.forEach((chatter) => {
            chatterNames = [
              ...chatterNames,
              {
                name: chatter.chatterName,
                displayName: chatter.chatterDisplayName,
              },
            ];
            chatterPhotoURLs = [...chatterPhotoURLs, chatter.chatterPhotoURL];
          });
          return (
            <div
              key={`${index}${createRandomString(5)}`}
              className={[`${styles.chat} chatListItem`]}
              id={`chatListItem${c.id}`}
              onClick={() => messageOpen(c)}
            >
              <div
                className={[`${styles.imageWrapper} chatListItem`]}
                style={{ '--imageWrapperSize': '4rem' }}
              >
                {chatterPhotoURLs.map((u, uI) => (
                  <img
                    key={`${u}${uI}`}
                    src={u}
                    alt=""
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
                  {chatterNames.map((n, cI) => {
                    return (
                      <span
                        key={`${cI}${n.name}`}
                        style={{
                          backgroundColor: 'transparent',
                          display: cI > 1 ? 'none' : 'inherit',
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: 'transparent',
                          }}
                        >
                          {n.displayName}
                        </span>
                        <span
                          style={{
                            display:
                              chatterNames.length > cI + 1 && cI !== 1 //if not at the end of the array AND it is not index 2
                                ? 'inline-block'
                                : 'none',
                          }}
                        >
                          ,&nbsp;
                        </span>
                      </span>
                    );
                  })}
                  <OverlayTrigger
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        {chatterNames.map((a, i) => (
                          <div
                            key={a.name}
                            style={{
                              display: i > 1 ? 'block' : 'none',
                            }}
                          >
                            {a.displayName}
                          </div>
                        ))}
                      </Tooltip>
                    }
                  >
                    <span
                      style={{
                        fontSize: 'small',
                        backgroundColor: 'var(--color-pallette-light)',
                        padding: '0.2rem',
                        margin: ' 0 0.2rem',
                        borderRadius: '0.2rem',
                        display:
                          chatterNames.length > 2 ? 'inline-block' : 'none',
                      }}
                    >
                      +&nbsp;{chatterNames.length - 2}&nbsp;more
                    </span>
                  </OverlayTrigger>
                </div>
                <div className={styles.lastComment}>
                  <span className={styles.lastCommentComment}>
                    {lastComment.comment ?? ''}
                  </span>
                </div>
              </div>
              <span className={styles.lastCommentDate}>{realTime ?? ''}</span>
              <div
                className={styles.unreadDot}
                style={{
                  visibility: unreadArray.includes(myID) ? 'visible' : 'hidden',
                }}
              ></div>
            </div>
          );
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={styles.createMessageButton}
          onClick={() => createNewMessage()}
        >
          <i className="far fa-edit"></i> New Message
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
