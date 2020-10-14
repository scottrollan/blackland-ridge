import React from 'react';
import Comment from './Comment';
import { createRandomString } from '../functions/CreateRandomString';
import styles from './MessagesHeader.module.scss';

let randomStr = createRandomString(12); //creates a 12-random-character string

const MessagesHeader = () => {
  return (
    <div className={styles.messagesHeader}>
      <Comment m={{ _id: randomStr }} newThread={true} fieldName="Message" />
    </div>
  );
};

export default MessagesHeader;
