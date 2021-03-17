import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { chatsCollection, timeStamp } from '../../firestore/index';
import { Form, Button } from 'react-bootstrap';
import $ from 'jquery';
// import styles from './NewMessageForm.module.scss';

export default function NewMessageForm({ theseRecipients, closeNewMessage }) {
  const thisUser = useContext(UserContext);
  const myID = thisUser.id;
  const me = thisUser.displayName;
  const myPhotoURL = thisUser.photoURL;
  const nowDate = new Date();
  const now = timeStamp.fromDate(nowDate);
  const [messageText, setMessageText] = useState('');
  const [recipients, setRecipients] = useState(theseRecipients ?? []);

  const submitNewMessage = (e) => {
    e.preventDefault();
    //prepare for submission
    let recipientsIDs = [];
    let recipientEmails = [];
    recipients.forEach((r) => {
      recipientsIDs = [...recipientsIDs, r.id];
      recipientEmails = [...recipientEmails, r.email];
    });
    let unread = [...recipientsIDs];
    let unreadEmails = [...recipientEmails];
    let chatters = [...recipientsIDs, myID]; //add myID to recipeints list
    let createdAt = now;
    let message = {
      date: now,
      id: myID,
      name: me,
      paragraphs: messageText.split('\n'),
      photoURL: myPhotoURL,
    };
    let updatedAt = now;
    const messageObj = {
      chatters,
      createdAt,
      messages: [{ ...message }],
      unread,
      unreadEmails,
      updatedAt,
    };
    chatsCollection.doc().set({
      ...messageObj,
    });
    setRecipients([]);
    $('#newMessageForm')[0].reset();
    closeNewMessage();
  };

  useEffect(() => {
    setRecipients(theseRecipients);
  }, [theseRecipients]);

  return (
    <Form onSubmit={submitNewMessage} id="newMessageForm">
      <Form.Group>
        <Form.Label srOnly>Enter Message Here</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="your message..."
          rows={5}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Button type="submit" variant="outline-secondary">
        Send Message
      </Button>
    </Form>
  );
}
