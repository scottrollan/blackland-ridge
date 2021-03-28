import React, { useState, useContext, useRef } from 'react';
import { UserContext } from '../../App';
import ResponseReactions from './ResponseReactions';
import ResponseIcons from './ResponseIcons';
import { profilesCollection } from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import { Overlay, Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import $ from 'jquery';
import styles from './SingleResponse.module.scss';

const SingleResponse = ({ m }) => {
  const thisResponse = { ...m };
  console.log(thisResponse);
  const thisUser = useContext(UserContext);
  const myID = thisUser.id ?? '';
  const [show, setShow] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const target = useRef(null);

  const handlePopoverShow = () => {
    setShow(true);
  };
  const handlePopoverHide = () => {
    setShow(false);
  };
  let authorIsMe = false;
  let originalPostDate;
  let rString = createRandomString(11);
  let photoURL;
  let thisAuthor;
  const authorRef = m.authorRef ?? '';
  const authID = authorRef.id;
  if (authID === myID) {
    authorIsMe = true;
  }
  const date = m.createdAt;
  const milliseconds = date.seconds * 1000;
  const rawDate = new Date(milliseconds);
  originalPostDate =
    rawDate.toLocaleString('default', {
      month: 'long',
    }) +
    ' ' +
    rawDate.getDate() +
    ', ' +
    rawDate.getFullYear();

  profilesCollection
    .doc(authID)
    .get()
    .then((doc) => {
      switch (doc.exists) {
        case true:
          const profile = { ...doc.data() };
          photoURL = profile.photoURL;
          thisAuthor = profile.displayName;
          $(`#image${rString}`).attr('src', photoURL);
          $(`#aTag${rString}`).attr('href', photoURL);
          $(`#name${rString}`).html(authorIsMe ? 'ME' : thisAuthor);
          break;
        default:
          console.log('Sorry, that user no longer exists');
      }
    })
    .catch((error) => {
      console.log(error.message);
    });

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.quoteContainer}>
        <div className={styles.avatarDiv}>
          <a
            href={photoURL}
            target="_blank"
            rel="noopener noreferrer"
            id={`aTag${rString}`}
          >
            <img
              src={photoURL}
              alt=""
              className={styles.avatarImg}
              id={`image${rString}`}
            />
          </a>
        </div>
        <div
          className={authorIsMe ? styles.quoteMe : styles.quote}
          ref={target}
          onClick={() => setShowInfo(!showInfo)}
        >
          {thisResponse.message.map((p) => {
            const pKey = createRandomString(10);
            return <p key={pKey}>{p}</p>;
          })}
        </div>
        <Overlay target={target.current} show={showInfo}>
          {(props) => (
            <Tooltip {...props}>
              <span id={`name${rString}`}></span> on {originalPostDate}
            </Tooltip>
          )}
        </Overlay>
      </div>

      <div className={styles.messageImagesDiv}>
        {thisResponse.attachedImages
          ? thisResponse.attachedImages.map((i) => {
              const iKey = createRandomString(9);
              return (
                <img
                  key={iKey}
                  src={i}
                  alt=""
                  className={styles.messageImage}
                />
              );
            })
          : null}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
        }}
      >
        <span style={{ width: '33%' }}>
          <ResponseIcons m={thisResponse} />
          {/* thisResponse contains responseToID */}
        </span>

        <OverlayTrigger
          trigger="click"
          placement="auto"
          show={show}
          onToggle={() => handlePopoverShow()}
          overlay={
            <Popover
              style={{ padding: '0.75rem' }}
              onClick={() => handlePopoverHide()}
            >
              <ResponseReactions m={thisResponse} />
            </Popover>
          }
        >
          <span
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '33%',
              visibility: thisUser ? 'visible' : 'hidden',
            }}
            className={styles.likeButton}
          >
            <span>
              <i className="far fa-thumbs-up" /> Like
            </span>{' '}
          </span>
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default SingleResponse;
