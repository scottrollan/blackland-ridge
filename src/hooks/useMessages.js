import React, { useState } from 'react';
// import { fetchMessages } from '../api/sanityClient';
import { messagesCollection } from '../firestore/index';

const useMessages = () => {
  const [theseMessages, setTheseMessages] = useState('');

  React.useEffect(() => {
    let messages = [];
    const getMessages = async () => {
      try {
        await messagesCollection.get().then((snapshot) => {
          snapshot.forEach((doc) => {
            const messageObj = { ...doc.data(), id: doc.id };
            messages.push(messageObj);
          });
        });
        setTheseMessages([...messages]);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, []);
  return theseMessages;
};

export default useMessages;
