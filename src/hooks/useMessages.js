import React, { useState } from 'react';
import { messagesCollection } from '../firestore/index';

const useMessages = () => {
  const [theseMessages, setTheseMessages] = useState('');

  React.useEffect(() => {
    let allMessages = [];
    let thisMessage = {};
    const getMessages = async () => {
      try {
        await messagesCollection.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            thisMessage = { ...doc.data(), id: doc.id };
            allMessages = [...allMessages, thisMessage];
          });
        });
      } catch (error) {
        console.log(error);
      } finally {
        setTheseMessages([...allMessages]);
      }
    };
    getMessages();
  }, []);
  return theseMessages;
};

export default useMessages;
