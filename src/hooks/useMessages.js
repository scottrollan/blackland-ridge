import React, { useState } from 'react';
import { messagesCollection } from '../firestore/index';

const useMessages = () => {
  const [theseMessages, setTheseMessages] = useState('');
  // const [newThreads, setNewThreads] = useState('');

  React.useEffect(() => {
    let allMessages = [];
    try {
      messagesCollection.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const thisMessage = { ...doc.data(), id: doc.id };
          allMessages.push(thisMessage);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTheseMessages(allMessages);
    }
  }, []);
  return theseMessages;
};

export default useMessages;
