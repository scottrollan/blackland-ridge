import React from 'react';
import { Client } from '../api/sanityClient';
import Comment from '../components/Comment';
import {
  Card as UICard,
  CardHeader,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Typography,
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
  reactions,
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
            <div className={styles.statsRow}>
              <div className={styles.statsReactions}>
                {reactions.map((r, index) => {
                  let num = parseInt(m[`${r.title}`]);

                  return (
                    <Tooltip
                      key={`${r.title}${index}`}
                      placement="right-start"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">{r.label}</Typography>
                          {m[r.array]
                            ? m[r.array].map((by) => {
                                return <Typography key={by}>{by}</Typography>;
                              })
                            : null}
                        </React.Fragment>
                      }
                    >
                      <i
                        className={[`${r.fontawesome} ${styles.icon}`]}
                        style={{
                          color: r.color,
                          // zIndex: r.length - index,
                          display: num > 0 ? 'inherit' : 'none',
                        }}
                      ></i>
                    </Tooltip>
                  );
                })}

                <span
                  style={{
                    marginLeft: '12px',
                  }}
                >
                  {numberOfReactions.toString()}
                </span>
              </div>
              <div
                className={styles.statsComments}
                style={{
                  display: numberOfResponses ? 'inherit' : 'none',
                }}
              >
                {numberOfResponses} Comments
              </div>
              <div
                className={styles.statsComments}
                style={{
                  display: numberOfResponses ? 'none' : 'block',
                }}
              >
                Comment
              </div>
            </div>{' '}
          </AccordionSummary>
          <AccordionDetails className={styles.repliesDiv}>
            <Comment m={m} newThread={false} getMessages={getMessages} />
            {!myRefs
              ? null
              : theseResponses.map((resp) => {
                  return (
                    <div className={styles.responseCard} key={resp._id}>
                      <figure
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          textAligh: 'center',
                          width: '15%',
                          float: 'left',
                          marginRight: '0.5rem',
                        }}
                      >
                        <img
                          className={styles.media}
                          src={urlFor(resp.avatar)}
                          alt=""
                          style={{
                            alignSelf: 'center',
                            // justifySelf: 'center',
                            borderRadius: '50%',
                          }}
                        />
                        <figcaption
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            textAlign: 'center',
                          }}
                        >
                          {resp.author}
                        </figcaption>
                      </figure>
                      <span style={{ marginLeft: '0.5rem' }}>
                        {resp.message} {resp._createdAt}
                      </span>
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
