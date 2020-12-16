import React, { useState } from 'react';
import { checkAuth, profilesCollection } from '../firestore';

const useAuth = () => {
  const [thisUser, setThisUser] = useState('');

  React.useEffect(() => {
    checkAuth(async (user) => {
      await user;

      if (user) {
        //if firebase returns a user (someone signs in)
        let searchID = user.uid; //get that user's id
        const newUser = {
          address: user.address ? user.address : '',
          displayName: user.displayName ? user.displayName : '',
          email: user.email ? user.email : '',
          emailVerified: user.emailVerified ? user.emailVerified : '',
          name: user.name ? user.name : '',
          phone: user.phone ? user.phone : '',
          photoURL: user.photoURL
            ? user.photoURL
            : `https://robohash.org/${
                user.displayName ? user.displayName : searchID
              }.png?bgset=bg2`,
          uid: [searchID],
          id: searchID,
          isNewUser: true,
          emailInDirectory: false,
          includeInDirectory: false,
          phoneInDirectory: false,
          receiveNotifications: true,
        };

        //go to firestore user database and search for a match
        const docRef = profilesCollection.doc(searchID);

        docRef
          .get()
          .then((doc) => {
            switch (doc.exists) {
              case true:
                const data = doc.data();
                data['ref'] = doc.ref;
                setThisUser(data);
                break;
              case false:
                setThisUser(newUser);
                break;
              default:
                break;
            }
          })
          .catch((error) => {
            console.log('Error getting user: ', error);
          });
        // const snapshot = await profilesCollection.get();
        // snapshot.forEach((doc) => {
        //   //copy list of firebase users to array
        //   userList = [...userList, { ...doc.data(), _id: doc.id }];
        // });
      }
    });
  }, []);
  return thisUser;
};

export default useAuth;
