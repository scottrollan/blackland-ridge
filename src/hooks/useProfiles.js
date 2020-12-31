import React, { useState } from 'react';
import { profilesCollection } from '../firestore/index';

const useProfiles = () => {
  const [theseProfiles, setTheseProfiles] = useState('');

  let data = {};

  React.useEffect(() => {
    let allProfiles = [];
    let thisProfile = {};
    const getProfiles = async () => {
      try {
        await profilesCollection.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            thisProfile = { ...doc.data(), id: doc.id };
            allProfiles = [...allProfiles, thisProfile];
          });
        });
      } catch (error) {
        console.log(error);
      } finally {
        setTheseProfiles([...allProfiles]);
      }
    };
    getProfiles();
  }, []);
  data = { allProfiles: theseProfiles };
  console.log(data);
  return data;
};

export default useProfiles;
