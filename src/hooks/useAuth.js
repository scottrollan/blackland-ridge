import React, { useState } from 'react';
import * as db from '../firestore';
import { Client } from '../api/sanityClient';
///////////////////////////////////////////////////
// import imageUrlBuilder from '@sanity/image-url';

// const builder = imageUrlBuilder(Client);

// const urlFor = (source) => {
//   return builder.image(source);
// };

// const src = urlFor(imageObj).url().toString();
//////////////////////////////////////////////////

const useAuth = () => {
  const [thisUser, setThisUser] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [showAuth, setShowAuth] = useState(true);
  let isAnonymous;
  let isLoggedIn;

  React.useEffect(() => {
    let response;

    db.checkAuth(async (user) => {
      if (user) {
        setThisUser(user);
        isLoggedIn = true;
        isAnonymous = await user.isAnonymous;
        if (!isAnonymous) {
          try {
            response = await Client.fetch(
              `*[_type == "profile" && "${user.uid}" in uid]`
            );
            setUserName(response[0].name);
            setUserPhoneNumber(response[0].phone);
            setUserEmail(response[0].email);
            setUserAddress(response[0].address);
            setUserPhotoURL(response[0].photoURL);
          } catch (error) {
            console.log(error.message);
          }
        } else {
          setShowAuth(false);
        }
      }
    });
  }, []);

  return {
    thisUser,
    userName,
    userPhoneNumber,
    userEmail,
    userAddress,
    userPhotoURL,
    isLoggedIn,
    isAnonymous,
    showAuth,
  };
};

export default useAuth;
