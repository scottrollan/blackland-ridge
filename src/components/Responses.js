import React, { useState, useContext, useEffect } from 'react';
import { MessagesContext } from '../App';
import { createRandomString } from '../functions/CreateRandomString';
import SingleMessage from './shared/SingleMessage';
import { Card as UICard } from '@material-ui/core';
import styles from './Responses.module.scss';

const Message = ({ m }) => {
  const allMessages = useContext(MessagesContext);
  let theseResponses = [];
  const myResponsesRefs = m.responses ?? [];
  const [myResponses, setMyResponses] = useState([]);

  useEffect(() => {
    if (myResponsesRefs.length > 0) {
      //if there is a list of response refs (m.responses)
      try {
        myResponsesRefs.map((r) => {
          const responseID = r.id; //extract response message id's
          const thisResponse = allMessages.find(
            (mess) => mess.id === responseID
          );
          theseResponses = [...theseResponses, { ...thisResponse }];
        });
      } finally {
        console.log(theseResponses);
        if (theseResponses.length > 0) {
          setMyResponses(
            theseResponses.sort((a, b) => {
              return a.createdAt - b.createdAt;
            })
          );
        }
      }
    }
  }, []);

  return myResponses.length > 0
    ? myResponses.map((r) => {
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
            <SingleMessage m={r} />
          </UICard>
        );
      })
    : null;
};

export default Message;
