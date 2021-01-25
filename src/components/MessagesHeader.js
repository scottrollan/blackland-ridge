import React, { useContext } from 'react';
import { UserContext } from '../App';
import Comment from './shared/Comment';
import { createRandomString } from '../functions/CreateRandomString';
import $ from 'jquery';
import styles from './MessagesHeader.module.scss';

let randomStr = createRandomString(12);

const showForm = () => {
  $('#commentDiv').css('display', 'flex');
  $('#iconDiv').hide();
};

const MessagesHeader = () => {
  const user = useContext(UserContext);
  const userName = user.displayName;

  return (
    <div className={styles.messagesHeader}>
      <div className={styles.iconDiv} id="iconDiv" onClick={() => showForm()}>
        <h5>
          <span>
            What's on your mind
            <span style={{ display: userName ? 'inherit' : 'none' }}>
              , {userName}
            </span>
            ?
          </span>
        </h5>
        <i className={[`fal fa-comment-lines ${styles.icon}`]}></i>
      </div>
      <div id="commentDiv" className={styles.commentDiv}>
        <Comment
          m={{ _id: randomStr }}
          newThread={true}
          fieldName="Message *"
          formID="commentNewThread"
          titleID="titleNewThread"
          messageTypeID="newThread"
        />
      </div>
    </div>
  );
};

export default MessagesHeader;
