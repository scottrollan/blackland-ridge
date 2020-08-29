import React from 'react';
import * as db from '../firestore';

const useAuth = () => {
  const [thisUser, setThisUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [userName, setUserName] = React.useState(null);

  React.useEffect(() => {
    return db.checkAuth((user) => {
      setLoading(false);
      setThisUser(user);
      setUserName(user.displayName);
      console.log(user.displayName);
    });
  }, []);

  return { thisUser, loading, userName };
};

export default useAuth;
