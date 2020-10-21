import React, { useEffect, useState, useContext } from 'react';
import { Client, client, fetchMessages } from '../api/sanityClient';
import { UserContext, MessagesContext } from '../App';
import MessagesHeader from '../components/MessagesHeader';
import Message from '../components/Message';
import $ from 'jquery';
import styles from './Messages.module.scss';

const Messages = () => {
  const thisUser = useContext(UserContext);
  const theseMessages = useContext(MessagesContext);
  const [messages, setMessages] = useState([...theseMessages]);
  const me = thisUser.name;

  const affectReaction = async (reaction, array, color, message) => {
    //from Message.js -> ReactionsIcons.js
    const origMessage = message;
    const messageID = message._id;
    const el = `#${reaction}Of${messageID}`;
    const incDec = $(el).attr('action'); //inc or dec is determined in ReactionsIcons.js
    let newParams = [];
    if (origMessage[`${array}`]) {
      //if message.likedBy (i.e.) is already there...
      newParams = [...origMessage[`${array}`]]; // = ["Jane", "Joe", "John"] sets newparams to equal array that already exists
    }
    let updated = {};

    if (incDec === 'inc') {
      $('.byIcon').css('visibility', 'hidden'); // hide all icons
      $(el).css('color', color).css('visibility', 'visible'); // but color and show the one selected
      if (origMessage[`${array}`]) {
        newParams = [...origMessage[`${array}`], me]; //add user's name to the array of reactioners if array already exists
      } else {
        newParams = [me]; //create array and add name if array doesn't exist
      }
      $(el).attr('action', 'dec'); //reverse the inc/dec so that it decreases on the next click
    } else {
      $('.byIcon').css('visibility', 'visible'); // show all icons because none have been clicked yet
      $(el).css('color', 'var(--overlay-medium)'); //gray out the "unclicked" icon
      const index = origMessage[`${array}`].indexOf(me); //splice me from array of likes,e tc.
      if (index > -1) {
        newParams.splice(index, 1);
      }
      $(el).attr('action', 'inc'); //rever the inc/dec so that it increases on the next click
    }
    try {
      updated = await Client.patch(messageID)
        .set({ [`${array}`]: newParams })
        .commit();
      return updated;
    } catch (error) {
      console.log(error);
    }
  };
  let subscription;
  const query = "*[_type == 'message'] | order(commentAdded desc)";
  subscription = client.listen(query).subscribe(async (update) => {
    const comment = update.result; //returns main (newThread) message (not the response to it)
    console.log(comment);
    const refresh = await fetchMessages();
    setMessages([...refresh]);
  });

  useEffect(() => {
    setMessages([...theseMessages]);

    subscription = client.listen(query).subscribe(async (update) => {
      const comment = update.result; //returns main (newThread) message (not the response to it)
      console.log(comment);
      setTimeout(() => $('#loading').css('display', 'none'), 3000);

      $('#alertThis')
        .text(
          `Someone just replied or reacted to ${comment.author}'s post: "${comment.title}"`
        )
        .css('display', 'flex');
      setTimeout(() => $('#alertThis').css('display', 'none').text(''), 8400);
      const response = await fetchMessages();
      setMessages([...response]);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [theseMessages]);

  return (
    <div className={styles.messages}>
      <MessagesHeader />
      {messages.map((m) => {
        let theseResponses = [];
        let myRefs = [];
        if (m.responses) {
          //make an array of message id's (strings)
          m.responses.forEach((re) => {
            myRefs = [...myRefs, re._ref];
          });
          const revArray = messages.filter((mess) => myRefs.includes(mess._id)); //filter messages that are included in the array created above (filters out !included)
          theseResponses = revArray.reverse(); // orders them from oldest to newest
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

        let numberOfReactions = likedBy + lovedBy + criedBy + laughedBy; //total number of reactions

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
          />
        );
      })}
    </div>
  );
};

export default Messages;
