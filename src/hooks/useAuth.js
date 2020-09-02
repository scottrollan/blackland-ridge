import React from 'react';
import * as db from '../firestore';

const useAuth = () => {
  const [thisUser, setThisUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    return db.checkAuth((user) => {
      if (user) {
        setLoading(false);
        setThisUser(user);
        setIsLoggedIn(true);
      }
    });
  }, []);

  return { thisUser, loading, isLoggedIn };
};

export default useAuth;
