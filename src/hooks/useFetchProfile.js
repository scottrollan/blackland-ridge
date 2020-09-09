import React from 'react';
import { Client } from '../api/sanityClient';

const useFetchProfile = (uid) => {
  const [userName, setUserName] = React.useState('');
  const [userPhoneNumber, setUserPhoneNumber] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const [userAddress, setUserAddress] = React.useState('');
  const [userPhotoURL, setUserPhotoURL] = React.useState(null);

  React.useEffect(() => {
    try {
      const response = Client.fetch(`*[_type === "profile" && ${uid} in uid]`);
      setUserName(response.name);
      setUserPhoneNumber(response.phone);
      setUserEmail(response.email);
      setUserAddress(response.address);
      setUserPhotoURL(response.photoURL);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return { userName, userPhoneNumber, userEmail, userAddress, userPhotoURL };
};

export default useFetchProfile;
