import React, { useEffect, useState } from 'react';
import { timeStamp, messagesCollection } from '../../firestore/index';
import QuickButtons from '../../components/shared/QuickButtons';
import MessagesHeader from '../../components/MessagesHeader';
import SingleMessage from '../../components/shared/SingleMessage';
import Footer from '../../components/shared/Footer';
import { createRandomString } from '../../functions/CreateRandomString';

import styles from './Messages.module.scss';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const uniqBy = require('lodash/uniqBy');
    let filteredMessages = [];
    const today = new Date();
    const lastSixtyDays = new Date(today - 5184000000); //today - 60 days
    const sixtyDaysAgo = timeStamp.fromDate(lastSixtyDays);
    messagesCollection
      .where('updatedAt', '>', sixtyDaysAgo)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          filteredMessages = [
            ...filteredMessages,
            { ...change.doc.data(), id: change.doc.id },
          ];
          if (change.type === 'added') {
            let mergedMessages = [...messages, ...filteredMessages];
            mergedMessages.sort((a, b) => {
              return a.updatedAt > b.updatedAt ? -1 : 1; //most recent at top
            });
            mergedMessages = uniqBy(mergedMessages, 'id');
            setMessages([...mergedMessages]);
          }
          // if (change.type === 'modified') {
          //   console.log('Thread modified.');
          // }
        });
      });
    const unsubscribe = messagesCollection.onSnapshot(() => {});

    return unsubscribe();
  }, [messages]);

  return (
    <>
      <QuickButtons />
      <div className={styles.messages}>
        <MessagesHeader />
        {messages.map((m) => {
          const divKey = createRandomString(8);
          return (
            <div
              key={divKey}
              className={styles.card}
              style={{
                display: m.newThread ? 'flex' : 'none',
              }}
            >
              <SingleMessage m={m} responseIndex={-2} />
            </div>
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default Messages;
