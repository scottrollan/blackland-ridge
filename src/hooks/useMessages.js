import React, { useState } from 'react';
import { fetchMessages } from '../api/sanityClient';

const useMessages = () => {
  const [theseMessages, setTheseMessages] = useState('');

  const getMessages = async () => {
    const response = await fetchMessages();
    setTheseMessages(response);
  };

  React.useEffect(() => {
    getMessages();
  }, []);
  return theseMessages;
};

export default useMessages;
