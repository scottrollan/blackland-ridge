import { useState, useEffect } from 'react';
import { profilesCollection } from '../firestore';

export const useProfiles = () => {
  const [theseProfiles, setTheseProfiles] = useState([]);

  useEffect(() => {
    let profileArray = [];
    let profileInfo;
    profilesCollection.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const profile = { ...doc.data(), id: doc.id };
        profileInfo = {
          id: profile.id,
          name: profile.name,
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          receiveNotifications: profile.receiveNotifications,
          email: profile.email,
          phone: profile.phone,
        };
        profileArray = [...profileArray, profileInfo];
      });
      setTheseProfiles([...profileArray]);
    });
  }, []);
  return theseProfiles;
};

export default useProfiles;
