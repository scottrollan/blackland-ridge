import React, { useEffect, useState, useContext } from 'react';
import { MessagesContext } from '../App';
import MessagesHeader from '../components/MessagesHeader';
import SingleMessage from '../components/shared/SingleMessage';
import Responses from '../components/Responses';
import styles from './Messages.module.scss';
import { createRandomString } from '../functions/CreateRandomString';

const Messages = () => {
  // const thisUser = useContext(UserContext);
  const theseMessages = useContext(MessagesContext);
  const [messages, setMessages] = useState([...theseMessages]);

  useEffect(() => {
    setMessages([...theseMessages]);
  }, [theseMessages]);

  return (
    <div className={styles.messages}>
      <MessagesHeader />
      {messages.map((m) => {
        const divKey = createRandomString(8);
        const responseArray = m.responses ? [...m.responses] : [];
        return (
          <div
            key={divKey}
            className={styles.card}
            style={{
              display: m.newThread ? 'flex' : 'none',
            }}
          >
            <SingleMessage
              // thisSrc={thisSrc}
              // avatarID={avatarID}
              // originalPostDate={originalPostDate}
              m={m}
            />
            <Responses myResponsesArray={responseArray} />
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
