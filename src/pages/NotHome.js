import React, { useContext } from 'react';
import { UserContext } from '../App';

const NotHome = () => {
  const user = useContext(UserContext);
  return (
    <div>
      <h1 style={{ fontWeight: '900' }}>Not Home</h1>
      <h3>I know you, {user.name}!!</h3>
    </div>
  );
};

export default NotHome;
