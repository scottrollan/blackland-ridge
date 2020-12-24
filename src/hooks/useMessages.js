import React, { useState } from 'react';
import { messagesCollection } from '../firestore/index';

const useMessages = () => {
  const [theseMessages, setTheseMessages] = useState('');
  // const [newThreads, setNewThreads] = useState('');

  React.useEffect(() => {
    let allMessages = [];
    let thisMessage = {};
    try {
      messagesCollection.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          thisMessage = { ...doc.data(), myRef: doc.ref };
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
