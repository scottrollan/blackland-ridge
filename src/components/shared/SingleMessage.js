import React, { useState, useContext } from 'react';
import { UserContext } from '../../App';
import ResponseAccordion from '../ResponseAccordion';
import { profilesCollection } from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import $ from 'jquery';
import styles from './SingleMessage.module.scss';

const SingleMessage = ({ m }) => {
  const [thisMessage, setThisMessage] = useState({ ...m });
  const thisUser = useContext(UserContext);
  const myID = thisUser.id ?? '';
  const newThread = m.newThread ?? false;

  let authorIsMe = false;
  let originalPostDate;
  let rString = createRandomString(11);
  let photoURL;
  let thisAuthor;
  const authorRef = thisMessage.authorRef;
  const authID = authorRef.id;
  if (authID === myID) {
    authorIsMe = true;
  }
  const date = thisMessage.createdAt;
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

  React.useEffect(() => {
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
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div
        className={styles.messageWordsDiv}
        style={{
          flexDirection: !newThread && authorIsMe ? 'row-reverse' : 'row',
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
          <h4>{thisMessage.title ? thisMessage.title : null}</h4>
          <span style={{ fontSize: 'small' }}>{originalPostDate}</span>

          <div
            className={!newThread && authorIsMe ? styles.quoteMe : styles.quote}
          >
            {thisMessage.message.map((p) => {
              const pKey = createRandomString(10);
              return <p key={pKey}>{p}</p>;
            })}
          </div>
        </div>
      </div>
      <div className={styles.messageImagesDiv}>
        {thisMessage.attachedImages
          ? thisMessage.attachedImages.map((i) => {
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

      <ResponseAccordion fieldName={'Replies'} m={thisMessage} />
    </div>
  );
};

export default SingleMessage;
