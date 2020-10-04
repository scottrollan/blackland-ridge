import React, { useEffect, useState, useContext } from 'react';
import { Client, client } from '../api/sanityClient';
// import { reactions } from '../data/reactions';
import { UserContext } from '../App';
import MessagesHeader from '../components/MessagesHeader';
import Message from '../components/Message';
import $ from 'jquery';
import styles from './Messages.module.scss';

const Messages = () => {
  const thisUser = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const me = thisUser.name;

  const getMessages = async () => {
    try {
      const theseMessages = await Client.fetch(
        "*[_type == 'message'] | order(_updatedAt desc)"
      );
      setMessages(theseMessages);
    } catch (error) {
      console.log(error);
    }
  };
  //listening to database updates//
  const query = "*[_type == 'message'] | order(_updatedAt desc)";

  const affectReaction = async (reaction, array, color, message) => {
    const messageID = message._id;
    const el = `#${reaction}Of${messageID}`;
    const incDec = $(el).attr('action');
    let newParams = message;
    let updated = {};

    if (incDec === 'inc') {
      $(el).css('color', color);
      if (newParams[`${array}`]) {
        newParams[`${array}`] = [...newParams[`${array}`], me]; //add user's name to list of reactioners if array already exists
      } else {
        newParams[`${array}`] = [me]; //create and add name if array doesn't exist
      }
      $(el).attr('action', 'dec');
    } else {
      $(el).css('color', 'var(--overlay-medium)');
      const index = newParams[`${array}`].indexOf(me);
      if (index > -1) {
        newParams[`${array}`].splice(index, 1);
      }
      $(el).attr('action', 'inc');
    }
    try {
      updated = await Client.patch(messageID).set(newParams).commit();
      return updated;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
    let subscription;
    subscription = client.listen(query).subscribe(async (update) => {
      const comment = update.result; //returns main (newThread) message (not the response to it)
      console.log(update);

      $('#alertThis')
        .text(
          `Someone just replied or reacted to ${comment.author}'s post: "${comment.title}"`
        )
        .css('display', 'flex');
      setTimeout(() => $('#alertThis').css('display', 'none').text(''), 8400);
      setTimeout(() => {
        getMessages();
        $('#loading').css('display', 'none');
      }, 1200);
    });
    return () => {
      subscription.unsubscribe();
    };
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
        let likedBy = 0;
        if (m.likedBy) {
          likedBy = m.likedBy.length;
        }
        let lovedBy = 0;
        if (m.lovedBy) {
          lovedBy = m.lovedBy.length;
        }
        let laughedBy = 0;
        if (m.laughedBy) {
          laughedBy = m.laughedBy.length;
        }
        let criedBy = 0;
        if (m.criedBy) {
          criedBy = m.criedBy.length;
        }

        let numberOfReactions = likedBy + lovedBy + criedBy + laughedBy;

        if (m.responses) {
          numberOfResponses = m.responses.length;
        }
        return (
          <Message
            m={m}
            key={m._id}
            originalPostDate={originalPostDate}
            thisUser={thisUser}
            affectReaction={(title, array, color, message) =>
              affectReaction(title, array, color, message)
            }
            numberOfReactions={numberOfReactions}
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
