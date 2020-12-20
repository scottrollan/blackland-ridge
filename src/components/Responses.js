import React, { useState, useContext, useEffect } from 'react';
import { MessagesContext } from '../App';
import { messagesCollection } from '../firestore/index';
import { createRandomString } from '../functions/CreateRandomString';
import SingleMessage from './shared/SingleMessage';
import { Card as UICard } from '@material-ui/core';
import styles from './Responses.module.scss';

const Responses = ({ m }) => {
  const allMessages = useContext(MessagesContext);
  const [myResponses, setMyResponses] = useState([]);
  const responseIDs = m.responses ?? [];
  let theseResponses = [];

  useEffect(() => {
    if (responseIDs.length > 0) {
      //if there is a list of response refs (m.responses)
      try {
        responseIDs.map((r) => {
          const responseID = r.id; //extract response message id's
          const thisResponse = allMessages.find(
            (mess) => mess.id === responseID
          );
          console.log(thisResponse);
          if (thisResponse !== undefined) {
            theseResponses = [...theseResponses, { ...thisResponse }];
          }
          theseResponses = [...new Set(theseResponses)];
        });
      } finally {
        console.log(theseResponses);
        if (theseResponses.length > 0) {
          setMyResponses(
            theseResponses.sort((a, b) => {
              return a.updatedAt - b.updatedAt;
            })
          );
        }
      }
    }
  }, []);

  return myResponses.length > 0
    ? myResponses.map((mr) => {
        const key = createRandomString(5);
        return (
          <UICard
            key={key}
            // id={m._id}
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
