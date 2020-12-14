import React, { useState, useContext, useEffect } from 'react';
import { UserContext, MessagesContext } from '../App';
import SingleMessage from './shared/SingleMessage';
import { reactions } from '../data/reactions';
import ReactAndComment from './shared/ReactAndComment';
import ReactionIcons from './shared/ReactionIcons';
import Comment from './Comment';
import {
  Card as UICard,
  CardHeader,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import HTMLParser from 'react-html-parser';
import { Card } from 'react-bootstrap';
import styles from './Responses.module.scss';

const Message = ({ myResponsesArray }) => {
  const [myResponses, setMyResponses] = useState([]);
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const theseMessages = useContext(MessagesContext);
  let allMessages = theseMessages;
  let allResponses = [];

  useEffect(() => {
    const getResponses = () => {
      if (myResponsesArray.length > 0) {
        //if there is a list of response refs (responses, props from parent)
        try {
          myResponsesArray.map((r) => {
            const responseID = r.id; //extract response message id's
            const thisResponse = allMessages.find(
              (mess) => mess.id === responseID
            );
            allResponses = [...allResponses, thisResponse];
          });
        } finally {
          setMyResponses(
            allResponses.sort((a, b) => {
              return a.createdAt - b.createdAt;
            })
          );
        }
      }
    };

    getResponses();
  }, []);

  return myResponses.map((r) => (
    <UICard
      key={r.id}
      // id={m._id}
      className={styles.card}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SingleMessage m={r} />
    </UICard>
  ));
};

export default Message;
