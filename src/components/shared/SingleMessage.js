import React, { useState, useContext } from 'react';
import { UserContext, MessagesContext } from '../../App';
import ResponseAccordion from '../ResponseAccordion';
import { profilesCollection } from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import $ from 'jquery';
import styles from './SingleMessage.module.scss';

const SingleMessage = ({ m }) => {
  const thisUser = useContext(UserContext);
  const userID = thisUser.id ?? '';
  let myID = userID.trim();
  const theseMessages = useContext(MessagesContext);
  const [messages, setMessages] = useState([...theseMessages]);
  const newThread = m.newThread;

  let theseResponses = [];
  let myRefs = [];
  let authorIsMe = false;
  if (m.responses) {
    //make an array of message id's (strings)
    m.responses.forEach((re) => {
      myRefs = [...myRefs, re.id];
    });
    theseResponses = messages.filter((id) => myRefs.includes(id)); //filter messages that are included in the response id array created above
  }
  const date = m.createdAt;
  const milliseconds = date.seconds * 1000;
  const rawDate = new Date(milliseconds);
  const originalPostDate =
    rawDate.toLocaleString('default', {
      month: 'long',
    }) +
    ' ' +
    rawDate.getDate() +
    ', ' +
    rawDate.getFullYear();
  let numberOfResponses = 0;
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

  if (m.responses) {
    numberOfResponses = m.responses.length;
  }
  const rString = createRandomString(11);
  let thisSrc;
  let thisAuthor;
  const authorRef = m.authorRef;
  const authID = authorRef.id;
  const authorID = authID.trim();
  if (authorID === myID) {
    authorIsMe = true;
  }
  const docRef = profilesCollection.doc(authorID);
  docRef
    .get()
    .then((doc) => {
      switch (doc.exists) {
        case true:
          const profile = doc.data();
          thisSrc = profile.photoURL;
          thisAuthor = profile.displayName;
          $(`#image${rString}`).attr('src', thisSrc);
          $(`#aTag${rString}`).attr('href', thisSrc);
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
    <div>
      <div
        className={styles.messageWordsDiv}
        style={{
          flexDirection: !newThread && authorIsMe ? 'row-reverse' : 'row',
        }}
      >
        <div className={styles.avatarDiv}>
          <a
            href={thisSrc}
            target="_blank"
            rel="noopener noreferrer"
            id={`aTag${rString}`}
          >
            <img
              src={thisSrc}
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
            {m.message.map((p) => {
              const pKey = createRandomString(10);
              return <p key={pKey}>{p}</p>;
            })}
          </div>
        </div>
      </div>
      <div className={styles.messageImagesDiv}>
        {m.attachedImages
          ? m.attachedImages.map((i) => {
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
      <ResponseAccordion newThread={false} fieldName={'Reply'} m={m} />
    </div>
  );
};

export default SingleMessage;
