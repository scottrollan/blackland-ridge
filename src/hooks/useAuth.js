import React, { useState } from 'react';
import { checkAuth, profilesCollection } from '../firestore';

export const useAuth = () => {
  const [thisUser, setThisUser] = useState('');

  React.useEffect(() => {
    checkAuth(async (user) => {
      await user;
      if (user) {
        const token = await user.getIdToken();

        //if firebase returns a user (someone signs in with auth)
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
          firstTimeLogin: true,
          emailInDirectory: false,
          includeInDirectory: false,
          phoneInDirectory: false,
          receiveNotifications: true,
          token: token,
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
                data['firstTimeLogin'] = false;
                data['token'] = token;
                setThisUser(data);
                break;
              case false:
                setThisUser(newUser); //returns user obj with no address,
                break;
              default:
                break;
            }
          })
          .catch((error) => {
            console.log('Error getting user: ', error);
          });
      }
    });
  }, []);
  return thisUser;
};

export default useAuth;
