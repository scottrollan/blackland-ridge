import React, { useContext } from 'react';
import { UserContext } from '../../App';
import ResponseReactions from './ResponseReactions';
import ResponseIcons from './ResponseIcons';
import { profilesCollection } from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import $ from 'jquery';
import styles from './SingleMessage.module.scss';

const SingleResponse = ({ m }) => {
  const thisResponse = { ...m };
  const thisUser = useContext(UserContext);
  const myID = thisUser.id ?? '';

  let authorIsMe = false;
  let originalPostDate;
  let rString = createRandomString(11);
  let photoURL;
  let thisAuthor;
  const authorRef = m.authorRef;
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
      <div
        className={styles.messageWordsDiv}
        style={{
          flexDirection: authorIsMe ? 'row-reverse' : 'row',
        }}
      >
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
              className={styles.avatar}
              id={`image${rString}`}
            />
          </a>
          <div style={{ letterSpacing: '0.2rem' }} id={`name${rString}`}></div>
        </div>
        <div className={styles.paragraphDiv}>
          <h4>{m.title ? m.title : null}</h4>
          <span style={{ fontSize: 'small' }}>{originalPostDate}</span>

          <div className={authorIsMe ? styles.quoteMe : styles.quote}>
            {thisResponse.message.map((p) => {
              const pKey = createRandomString(10);
              return <p key={pKey}>{p}</p>;
            })}
          </div>
        </div>
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
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span onClick={(e) => e.stopPropagation()}>
          <OverlayTrigger
            trigger="click"
            placement="auto"
            overlay={
              <Popover style={{ padding: '0.75rem' }}>
                <ResponseReactions m={thisResponse} />
              </Popover>
            }
          >
            <span>
              <i className="far fa-thumbs-up" /> Like
            </span>
          </OverlayTrigger>
        </span>
        <ResponseIcons m={thisResponse} />
        {/* thisResponse contains responseToID */}
      </div>
    </div>
  );
};

export default SingleResponse;
