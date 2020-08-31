import React from 'react';
import * as db from '../firestore';

const useAuth = () => {
  const [thisUser, setThisUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    return db.checkAuth((user) => {
      setLoading(false);
      setThisUser(user);
    });
  }, []);

  return { thisUser, loading };
};

//TWitter Bearer token: AAAAAAAAAAAAAAAAAAAAAJfzHAEAAAAAu6YOOOA0%2FSF4hT%2Ba5AJhYUhOklU%3DvOApaxhayB6NNEUrDrp1PweXoLJ6dBwNKXWFCLKnkW7tQPzOsU

export default useAuth;
