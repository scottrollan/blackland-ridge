import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../App';
import ResponseAccordion from '../ResponseAccordion';
import { profilesCollection, messagesCollection } from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import $ from 'jquery';
import styles from './SingleMessage.module.scss';

const SingleMessage = ({ m }) => {
  const thisMessage = { ...m };
  const messageID = m.id;
  const thisUser = useContext(UserContext);
  const userID = thisUser.id ?? '';
  let myID = userID.trim();
  const newThread = m.newThread ?? false;

  let authorIsMe = false;
  let originalPostDate;
  let rString;
  let photoURL;
  rString = createRandomString(11);
  let thisAuthor;
  const authorRef = m.authorRef;
  const authID = authorRef.id;
  // const authorID = authID.trim();
  if (authID === myID) {
    authorIsMe = true;
  }
  profilesCollection
    .doc(authID)
    .get()
    .then((doc) => {
      switch (doc.exists) {
        case true:
          const profile = { ...doc.data() };
          console.log('Retrieved profile from SingleMessage: ', profile);
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

  // useEffect(() => {
  //   const renderMessage = () => {
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

  let likedBy = 0;
  if (m.likedBy) {
    likedBy = m.likedBy.length;
  }
  let lovedBy = 0;
  if (m.lovedBy) {
    lovedBy = m.lovedBy.length;
  }
  let laughedBy = 0;
  if (m.laughedBy) {
    laughedBy = m.laughedBy.length;
  }
  let criedBy = 0;
  if (m.criedBy) {
    criedBy = m.criedBy.length;
  }

  let numberOfReactions = likedBy + lovedBy + criedBy + laughedBy; //total number of reactions
  // };

  //   renderMessage();
  // });

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
          <h4>{m.title ? m.title : null}</h4>
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
      <ResponseAccordion newThread={newThread} fieldName={'Replies'} m={m} />
    </div>
  );
};

export default SingleMessage;
