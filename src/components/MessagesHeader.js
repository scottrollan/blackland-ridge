import React from 'react';
import Comment from './Comment';
import { UserContext } from '../App';
import { createRandomString } from '../functions/CreateRandomString';
import $ from 'jquery';
import styles from './MessagesHeader.module.scss';

let randomStr = createRandomString(12); //creates a 12-random-character string

const MessagesHeader = () => {
  const me = React.useContext(UserContext);

  const openComment = () => {
    $('#mhIconDiv').css('display', 'none');
    $('#mhCommentDiv').css('display', 'flex');
  };

  return (
    <div className={styles.messagesHeader}>
      <div
        onClick={() => openComment()}
        className={styles.iconDiv}
        id="mhIconDiv"
      >
        <span>What's on your mind?</span>
        <i className="fal fa-comment-lines" style={{ fontSize: 48 }}></i>
      </div>
      <div className={styles.commentDiv} id="mhCommentDiv">
        <Comment m={{ _id: randomStr }} newThread={true} fieldName="Message" />
      </div>
    </div>
  );
};

export default MessagesHeader;
