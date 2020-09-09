import React from 'react';
import Profile from '../components/Profile';

const NotHome = () => {
  return (
    <div>
      <h1 style={{ fontWeight: '900' }}>Not Home</h1>

      <Profile show={true} />
    </div>
  );
};

export default NotHome;
