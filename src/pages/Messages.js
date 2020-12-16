import React, { useEffect, useState, useContext } from 'react';
import { MessagesContext } from '../App';
import MessagesHeader from '../components/MessagesHeader';
import SingleMessage from '../components/shared/SingleMessage';
import styles from './Messages.module.scss';
import { createRandomString } from '../functions/CreateRandomString';

const Messages = () => {
  // const thisUser = useContext(UserContext);
  const retrievedMessages = useContext(MessagesContext);
  const [messages, setMessages] = useState([...retrievedMessages]);

  useEffect(() => {
    const theseMessages = [...retrievedMessages];
    theseMessages.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
    setMessages([...theseMessages]);
  }, [retrievedMessages]);

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
            <SingleMessage m={m} myResponsesArray={responseArray} />
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
