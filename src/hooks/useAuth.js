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
  const [isNewUser, setIsNewUser] = useState(false);
  const [missingAddress, setMissingAddress] = useState(false);

  React.useEffect(() => {
    let response;
    let isAnonymous = false;
    db.checkAuth(async (user) => {
      if (user) {
        setThisUser(user);
        isAnonymous = await user.isAnonymous;
        if (!user.address) {
          setMissingAddress(true);
        }
        if (!isAnonymous) {
          try {
            response = await Client.fetch(
              `*[_type == "profile" && "${user.uid}" in uid]`
            );
            if (response.length === 0) {
              //user not in Sanity cms
              setIsNewUser(true);
              let uidArray = [];
              uidArray.push(user.uid);

              let name = 'Neighbor';
              if (user.displayName) {
                name = user.displayName;
              } else if (user.email) {
                const emailName = user.email.split('@')[0];
                name = emailName;
              }
              let email = '';
              if (user.email) {
                email = user.email;
              }
              let phone = '';
              if (user.phoneNumber) {
                phone = user.phoneNumber;
              }
              let photoURL = '';
              if (user.photoURL) {
                photoURL = user.photoURL;
              }
              const newUser = {
                _type: 'profile',
                uid: uidArray,
                name,
                email,
                phone,
                photoURL,
                address: '',
              };
              try {
                response = await Client.create(newUser);
              } catch (error) {
                console.log('Create Failed: ', error.message);
              }
            }
            setUserName(response[0].name);
            setUserPhoneNumber(response[0].phone);
            setUserEmail(response[0].email);
            setUserAddress(response[0].address);
            setUserPhotoURL(response[0].photoURL);
          } catch (error) {
            console.log(error.message);
          }
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
    isNewUser,
    missingAddress,
  };
};

export default useAuth;
