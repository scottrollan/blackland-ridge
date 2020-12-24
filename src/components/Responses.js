import React, { useState, useEffect } from 'react';
import { messagesCollection } from '../firestore/index';
import { createRandomString } from '../functions/CreateRandomString';
import SingleMessage from './shared/SingleMessage';
import { Card as UICard } from '@material-ui/core';
import styles from './Responses.module.scss';

const Responses = ({ m }) => {
  const thisMessage = { ...m };
  const messageID = thisMessage.id;
  const [myResponses, setMyResponses] = useState([]);

  useEffect(() => {
    let mounted = true;
    let theseResponses = [];
    messagesCollection
      .where('id', '==', `${messageID}`)
      .onSnapshot((snapshot) => {
        try {
          snapshot.docChanges().forEach((change) => {
            const changeData = { ...change.doc.data() };
            theseResponses = changeData.responses ?? [];
            theseResponses.sort((a, b) => {
              return a.createdAt > b.createdAt ? 1 : -1; //most recent at top
            });
          });
        } finally {
          if (mounted) {
            setMyResponses([...theseResponses]);
          }
        }
      });

    const unsubscribe = messagesCollection.onSnapshot(function () {});

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [messageID]);

  return myResponses.length > 0
    ? myResponses.map((mr) => {
        const key = createRandomString(7);
        return (
          <UICard
            key={key}
            className={styles.card}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <SingleMessage m={mr} />
          </UICard>
        );
      })
    : null;
};

export default Responses;
