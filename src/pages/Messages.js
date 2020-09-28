import React, { useEffect, useState, useContext } from 'react';
import { Client } from '../api/sanityClient';
import { reactions } from '../data/reactions';
import { UserContext } from '../App';
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
  TextField,
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
  const thisUser = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const me = thisUser.name;
  const myPic = urlFor(thisUser.image);

  const getMessages = async () => {
    const theseMessages = await Client.fetch(
      "*[_type == 'message' && newThread] | order(_updatedAt desc)"
    );
    setMessages(theseMessages);
    console.log(theseMessages);
  };

  const affectReaction = async (reaction, array, color, message) => {
    const messageID = message._id;
    const el = `#${reaction}Of${messageID}`;
    const incDec = $(el).attr('action');
    let newParams = message;
    let updated = {};

    if (incDec === 'inc') {
      $(el).css('color', color);
      newParams[`${reaction}`] = Number(newParams[`${reaction}`]) + 1; //add one to the number of <whatever> reactions
      if (newParams[`${array}`]) {
        newParams[`${array}`] = [...newParams[`${array}`], me]; //add user's name to list of reactioners if array already exists
      } else {
        newParams[`${array}`] = [me]; //create and add name if array doesn't exist
      }
      $(el).attr('action', 'dec');
    } else {
      $(el).css('color', 'var(--overlay-medium)');
      newParams[`${reaction}`] = Number(newParams[`${reaction}`]) - 1; //subtract one from the number of <whatever> reactions
      const index = newParams[`${array}`].indexOf(me);
      if (index > -1) {
        newParams[`${array}`].splice(index, 1);
      }
      $(el).attr('action', 'inc');
    }
    updated = await Client.patch(messageID).set(newParams).commit();
    console.log(updated);
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
                  <form
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        width: '85%',
                      }}
                    >
                      <img
                        src={myPic}
                        alt=""
                        style={{ borderRadius: '50%', alignSelf: 'center' }}
                      />
                      <TextField
                        id={`replyTo${m._id}`}
                        label="Reply"
                        variant="outlined"
                        position="start"
                        edge="end"
                        style={{ marginLeft: '0.5rem', flex: 1 }}
                      ></TextField>
                    </div>
                  </form>
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
