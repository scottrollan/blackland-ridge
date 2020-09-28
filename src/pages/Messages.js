import React, { useEffect, useState } from 'react';
import { Client } from '../api/sanityClient';
import { reactions } from '../data/reactions';
import {
  Card as UICard,
  CardHeader,
  CardMedia,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Card } from 'react-bootstrap';
import $ from 'jquery';
import imageUrlBuilder from '@sanity/image-url';
import styles from './Messages.module.scss';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    const theseMessages = await Client.fetch(
      "*[_type == 'message' && newThread] | order(_updatedAt desc)"
    );
    setMessages(theseMessages);
    console.log(theseMessages);
  };

  const toggleReaction = async (reaction, messageID, count) => {
    const el = `#${reaction}Of${messageID}`;

    if ($(el).attr('action') === 'inc') {
      $(el).attr('action', 'dec');
    } else {
      $(el).attr('action', 'inc');
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className={styles.messages}>
      <h3>Messages</h3>
      {messages.map((m) => {
        let theseResponses = [];
        let date = new Date(m._createdAt);
        let originalPostDate =
          date.toLocaleString('default', {
            month: 'long',
          }) +
          ' ' +
          date.getDate() +
          ', ' +
          date.getFullYear();
        let numberOfResponses = 0;
        let numberOfReactions =
          parseInt(m.likes) +
          parseInt(m.loves) +
          parseInt(m.cries) +
          parseInt(m.laughs);

        if (m.responses) {
          numberOfResponses = m.responses.length;
        }
        return (
          <UICard key={m._id} className={styles.card}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <figure>
                <img
                  className={styles.media}
                  src={urlFor(m.avatar)}
                  style={{ alignSelf: 'center' }}
                />
                <figcaption>{m.author}</figcaption>
              </figure>
              <CardHeader
                title={m.title}
                subheader={originalPostDate}
              ></CardHeader>
            </div>
            <Card.Body>
              <Card.Text>{m.message}</Card.Text>

              <CardActions disableSpacing>
                {reactions.map((icon) => {
                  let num = parseInt(m[`${icon.title}`]);
                  return (
                    <i
                      key={`${icon.title}of${m._id}`}
                      id={`${icon.title}Of${m._id}`}
                      action="inc"
                      onClick={() => toggleReaction(icon.title, m._id, num)}
                      className={[`${icon.fontawesome} ${styles.i}`]}
                      style={{
                        color: num > 0 ? icon.color : 'var(--overlay-medium)',
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
                                <Typography color="inherit">
                                  {r.label}
                                </Typography>
                                {m[r.array]
                                  ? m[r.array].map((by) => {
                                      return (
                                        <Typography key={by}>{by}</Typography>
                                      );
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
                          transform: 'translateY(-10px)',
                          marginLeft: '12px',
                        }}
                      >
                        {numberOfReactions}
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
                  <Card className={styles.card}>
                    <Card.Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget.
                    </Card.Text>
                  </Card>
                </AccordionDetails>
              </Accordion>
            </Card.Body>
          </UICard>
        );
      })}
    </div>
  );
};

export default Messages;
