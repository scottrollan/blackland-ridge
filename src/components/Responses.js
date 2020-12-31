import React, { useState, useEffect } from 'react';
import { messagesCollection } from '../firestore/index';
import { createRandomString } from '../functions/CreateRandomString';
import SingleResponse from './shared/SingleResponse';
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
    ? myResponses.map((mr, index) => {
        const key = createRandomString(7);
        mr = { ...mr, arrayIndex: index, responseToID: messageID }; // add index of responses array as an object, as well as the original message id, for later querying
        return (
          <UICard
            key={key}
            className={styles.card}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <SingleResponse m={mr} />
          </UICard>
        );
      })
    : null;
};

export default Responses;
