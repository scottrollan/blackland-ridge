import React, { useEffect, useState } from 'react';
// import { MessagesContext } from '../App';
import { messagesCollection } from '../firestore/index';
import MessagesHeader from '../components/MessagesHeader';
import SingleMessage from '../components/shared/SingleMessage';
import styles from './Messages.module.scss';
import { createRandomString } from '../functions/CreateRandomString';

const Messages = () => {
  const filteredMessages = [];
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    messagesCollection
      .where('newThread', '==', true)
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === 'added') {
            filteredMessages.push({ ...change.doc.data(), id: change.doc.id });
            let mergedMessages = [...messages, ...filteredMessages];
            mergedMessages.sort((a, b) => {
              return a.updatedAt > b.updatedAt ? -1 : 1; //most recent at top
            });
            setMessages([...mergedMessages]);
          }
          if (change.type === 'modified') {
            console.log('Thread modified.');
          }
        });
      });
    const unsubscribe = messagesCollection.onSnapshot(function () {});

    return unsubscribe();
  }, []);

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
