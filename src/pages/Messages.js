import React, { useEffect, useState, useContext } from 'react';
import { Client } from '../api/sanityClient';
import { reactions } from '../data/reactions';
import { UserContext } from '../App';
import MessagesHeader from '../components/MessagesHeader';
import Message from '../components/Message';
import $ from 'jquery';
import styles from './Messages.module.scss';

const Messages = () => {
  const thisUser = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const me = thisUser.name;

  const query = "*[_type == 'message'] | order(_updatedAt desc)";
  // const params = {ownerId: 'myUserId'}

  const subscription = Client.listen(query).subscribe(async (update) => {
    const comment = update.result; //returns main (newThread) message (not the response to it)

    $('#alertThis')
      .text(
        `Someone just replied or reacted to ${comment.author}'s post: "${comment.title}"`
      )
      .css('display', 'flex');
    setTimeout(() => $('#alertThis').css('display', 'none').text(''), 8400);
    getMessages();
    $('#loading').css('display', 'none');
  });

  const getMessages = async () => {
    const theseMessages = await Client.fetch(
      "*[_type == 'message'] | order(_updatedAt desc)"
    );

    setMessages(theseMessages);
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
    return updated;
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div
      className={styles.messages}
      style={{ display: thisUser ? 'flex' : 'none' }}
    >
      <MessagesHeader getMessages={() => getMessages} />
      {messages.map((m) => {
        let theseResponses = [];
        let myRefs = [];
        if (m.responses) {
          m.responses.forEach((re) => {
            myRefs = [...myRefs, re._ref];
          });
          const revArray = messages.filter((mess) => myRefs.includes(mess._id));
          theseResponses = revArray.reverse();
        }

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
          0 +
          parseInt(m.likes) +
          parseInt(m.loves) +
          parseInt(m.cries) +
          parseInt(m.laughs);

        if (m.responses) {
          numberOfResponses = m.responses.length;
        }
        return (
          <Message
            m={m}
            key={m._id}
            originalPostDate={originalPostDate}
            reactions={reactions}
            thisUser={thisUser}
            affectReaction={(title, array, color, message) =>
              affectReaction(title, array, color, message)
            }
            numberOfReactions={parseInt(numberOfReactions)}
            numberOfResponses={numberOfResponses}
            myRefs={myRefs}
            theseResponses={theseResponses}
            getMessages={() => getMessages}
          />
        );
      })}
    </div>
  );
};

export default Messages;
