import React, { useState } from 'react';
import * as db from '../firestore';
import sanityLogin from '../api/sanityLogin';

const useAuth = () => {
  const [thisUser, setThisUser] = useState('');

  React.useEffect(() => {
    db.checkAuth(async (user) => {
      await user;
      if (user) {
        const sanityUser = await sanityLogin(user);
        setThisUser(sanityUser); //then set User to user stored in Sanity//
      }
    });
  }, []);
  return thisUser;
};

export default useAuth;
