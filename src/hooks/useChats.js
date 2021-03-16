import { useState, useEffect } from 'react';
import { chatsCollection } from '../firestore';

export const useProfiles = () => {
  const [theseChats, setTheseChats] = useState([]);
  const [unread, setUnread] = useState([]);

  useEffect(() => {
    let chatArray = [];
    let unreadArray = [];
    chatsCollection.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataUnread = data.unread;
        unreadArray = [...unreadArray, ...dataUnread];
        const chat = { ...data, id: doc.id };
        chatArray = [...chatArray, chat];
      });
      setUnread([...unreadArray]);
      setTheseChats([...chatArray]);
    });
  }, []);
  return [theseChats, unread];
};

export default useProfiles;
