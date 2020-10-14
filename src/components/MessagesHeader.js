import React from 'react';
import Comment from './Comment';
import { createRandomString } from '../functions/CreateRandomString';
import $ from 'jquery';
import styles from './MessagesHeader.module.scss';

let randomStr = createRandomString(12); //creates a 12-random-character string to use as new message _id

const showForm = () => {
  $('#commentDiv').css('display', 'flex');
  $('#iconDiv').hide();
};

const MessagesHeader = () => {
  return (
    <div className={styles.messagesHeader}>
      <div className={styles.iconDiv} id="iconDiv" onClick={() => showForm()}>
        <h5>What's on your mind?</h5>
        <i
          className="fal fa-comment-lines"
          style={{ fontSize: 48, margin: '0 1rem' }}
        ></i>
      </div>
      <div id="commentDiv" className={styles.commentDiv}>
        <Comment m={{ _id: randomStr }} newThread={true} fieldName="Message" />
      </div>
    </div>
  );
};

export default MessagesHeader;
