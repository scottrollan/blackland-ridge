import React from 'react';
import * as db from '../firestore';
import $ from 'jquery';

const useAuth = () => {
  const [thisUser, setThisUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    db.checkAuth((user) => {
      if (user) {
        setLoading(true);
        setThisUser(user);
        setIsLoggedIn(true);
        $('#firebaseui-auth-container').modal('hide');
        setTimeout(setLoading(false), 2000);
      }
    });
  }, []);

  return { thisUser, loading, isLoggedIn };
};

export default useAuth;
