import React from 'react';
import { createRandomString } from '../functions/CreateRandomString';
import Comment from './Comment';
import styles from './MessagesHeader.module.scss';

let randomStr = createRandomString(12);

const MessagesHeader = () => {
  return (
    <div className={styles.messagesHeader}>
      <h4>Post a New Message</h4>
      <Comment m={{ _id: randomStr }} newThread={true} fieldName="Message" />
    </div>
  );
};

export default MessagesHeader;
