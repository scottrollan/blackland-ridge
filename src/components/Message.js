import React from 'react';
import { Client } from '../api/sanityClient';
import { reactions } from '../data/reactions';
import ReactAndComment from '../components/shared/ReactAndComment';
import ReactionIcons from '../components/shared/ReactionIcons';
import Comment from '../components/Comment';
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
import imageUrlBuilder from '@sanity/image-url';
import styles from './Message.module.scss';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};

const Message = ({
  m,
  originalPostDate,
  thisUser,
  affectReaction,
  numberOfReactions,
  numberOfResponses,
  myRefs,
  theseResponses,
}) => {
  const me = thisUser.name;
  const messageImage = urlFor(m.image);

  return (
    <UICard
      key={m._id}
      id={m._id}
      className={styles.card}
      style={{
        display: m.newThread ? 'flex' : 'none',
        flexDirection: 'column',
      }}
    >
      <div className={styles.cardOuterDiv}>
        <figure title={`Orignally posted on ${originalPostDate}`}>
          <img
            className={styles.mainAvatar}
            src={urlFor(m.avatar)}
            alt=""
            style={{ borderRadius: '50%' }}
          />
        </figure>
        <CardHeader title={m.title}></CardHeader>
      </div>
      <Card.Body>
        {HTMLParser(m.message)}
        <span style={{ fontSize: 'smaller' }}>
          - {m.authorName}, {originalPostDate}
        </span>
        <a href={messageImage} target="_blank" rel="noopener noreferrer">
          <img
            src={messageImage ? messageImage : null}
            alt=""
            className={styles.messageImage}
          />
        </a>

        <CardActions disableSpacing>
          <ReactionIcons m={m} affectReaction={affectReaction} />
        </CardActions>
      </Card.Body>

      <Accordion>
        <AccordionSummary>
          <ReactAndComment
            reactions={reactions}
            m={m}
            numberOfReactions={numberOfReactions}
            numberOfResponses={numberOfResponses}
          />
        </AccordionSummary>
        <AccordionDetails className={styles.repliesDiv}>
          {!myRefs
            ? null
            : theseResponses.map((resp) => {
                const respImage = urlFor(resp.image);
                const date = new Date(resp._createdAt);
                let hours = date.getHours();
                let ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12; //if hour 0, make it 12
                hours = hours ? hours : 12;
                let minutes = date.getMinutes();
                minutes = minutes < 10 ? '0' + minutes : minutes;
                let originalPostDate =
                  date.toLocaleString('default', {
                    month: 'long',
                  }) +
                  ' ' +
                  date.getDate() +
                  ', ' +
                  date.getFullYear() +
                  ' - ' +
                  hours +
                  ':' +
                  minutes +
                  ' ' +
                  ampm;

                return (
                  <div
                    className={styles.responseCard}
                    key={resp._id}
                    title={originalPostDate}
                    style={{
                      flexDirection:
                        resp.authorName === me ? 'row-reverse' : 'row',
                    }}
                  >
                    <a
                      href={urlFor(resp.avatar)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <figure>
                        <img
                          className={styles.respAvatar}
                          src={urlFor(resp.avatar)}
                          alt=""
                        />
                      </figure>
                    </a>
                    <div
                      className={styles.textArea}
                      style={{
                        alignItems:
                          resp.authorName === me ? 'flex-end' : 'fles-start',
                      }}
                    >
                      <div
                        className={styles.authorName}
                        style={{
                          display: resp.authorName === me ? 'block' : 'none',
                        }}
                      >
                        ME
                      </div>
                      <div
                        className={styles.authorName}
                        style={{
                          display: resp.authorName === me ? 'none' : 'block',
                        }}
                      >
                        {resp.authorName.toUpperCase()}
                      </div>
                      <div
                        className={
                          resp.authorName === me
                            ? styles.chatBoxMe
                            : styles.chatBox
                        }
                      >
                        {HTMLParser(resp.message)}
                      </div>
                      <a
                        href={respImage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={respImage ? respImage : null}
                          alt=""
                          className={styles.respImage}
                        />
                      </a>
                      <ReactionIcons m={resp} affectReaction={affectReaction} />
                    </div>
                  </div>
                );
              })}
          <Comment
            m={m}
            newThread={false}
            fieldName="Reply"
            id={`commentInput${m._id}`}
          />
        </AccordionDetails>
      </Accordion>
      {/* </Card.Body> */}
    </UICard>
  );
};

export default Message;
