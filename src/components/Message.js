import React from 'react';
import { Client } from '../api/sanityClient';
import { reactions } from '../data/reactions';
import ReactAndComment from '../components/shared/ReactAndComment';
import Comment from '../components/Comment';
import {
  Card as UICard,
  CardHeader,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { Card } from 'react-bootstrap';
import imageUrlBuilder from '@sanity/image-url';
import styles from '../pages/Messages.module.scss';

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
  getMessages,
}) => {
  const me = thisUser.name;
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <figure
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <img
            className={styles.media}
            src={urlFor(m.avatar)}
            alt=""
            style={{
              alignSelf: 'center',
              justifySelf: 'center',
              borderRadius: '50%',
            }}
          />
          <figcaption>{m.author}</figcaption>
        </figure>
        <CardHeader title={m.title} subheader={originalPostDate}></CardHeader>
      </div>
      <Card.Body>
        <Card.Text>{m.message}</Card.Text>

        <CardActions disableSpacing>
          {reactions.map((icon) => {
            return (
              <i
                key={`${icon.title}of${m._id}`}
                id={`${icon.title}Of${m._id}`}
                action={
                  m[`${icon.array}`] && m[`${icon.array}`].includes(me)
                    ? 'dec'
                    : 'inc'
                } //if reaction array (i.e. likedBy) includes me, then the first click of this button should decrease the likes and remove me from the array (unlike)
                onClick={() =>
                  affectReaction(icon.title, icon.array, icon.color, m)
                }
                className={[`${icon.fontawesome} ${styles.icon}`]}
                style={{
                  color:
                    m[`${icon.array}`] && m[`${icon.array}`].includes(me) // if this reaction array (i.e. likedBy) includes me
                      ? icon.color // color it
                      : 'var(--overlay-medium)', //otherwise make it gray
                }}
              ></i>
            );
          })}
        </CardActions>
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
            <Comment
              m={m}
              newThread={false}
              getMessages={getMessages}
              fieldName="Reply"
            />
            {!myRefs
              ? null
              : theseResponses.map((resp) => {
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
                    <div className={styles.responseCard} key={resp._id}>
                      <figure>
                        <img
                          className={styles.media}
                          src={urlFor(resp.avatar)}
                          alt=""
                        />
                        <figcaption
                          style={{
                            width: '100%',
                            textAlign: 'center',
                          }}
                        >
                          {resp.author}
                        </figcaption>
                      </figure>
                      <span>
                        {resp.message}{' '}
                        <div>
                          <em>{originalPostDate}</em>
                        </div>
                      </span>
                      {reactions.map((icon) => {
                        return (
                          <i
                            key={`${icon.title}of${m._id}`}
                            id={`${icon.title}Of${m._id}`}
                            action={
                              m[`${icon.array}`] &&
                              m[`${icon.array}`].includes(me)
                                ? 'dec'
                                : 'inc'
                            } //if reaction array (i.e. likedBy) includes me, then the first click of this button should decrease the likes and remove me from the array (unlike)
                            onClick={() =>
                              affectReaction(
                                icon.title,
                                icon.array,
                                icon.color,
                                m
                              )
                            }
                            className={[`${icon.fontawesome} ${styles.icon}`]}
                            style={{
                              color:
                                m[`${icon.array}`] &&
                                m[`${icon.array}`].includes(me) // if this reaction array (i.e. likedBy) includes me
                                  ? icon.color // color it
                                  : 'var(--overlay-medium)', //otherwise make it gray
                            }}
                          ></i>
                        );
                      })}
                      {/* <Accordion /> */}
                    </div>
                  );
                })}
          </AccordionDetails>
        </Accordion>
      </Card.Body>
    </UICard>
  );
};

export default Message;
