import React, { useState } from 'react';
import * as db from '../firestore';
import sanityLogin from '../api/sanityLogin';

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

  React.useEffect(() => {
    db.checkAuth(async (user) => {
      const newUser = await user;
      if (newUser) {
        if (!newUser.isAnonymous) {
          //if not anonymous
          const sanityUser = await sanityLogin(user);
          setThisUser(sanityUser); //then set User to user stored in Sanity
        } else {
          setThisUser(user);
        }
      }
    });
  }, []);
  return thisUser;
};

export default useAuth;
