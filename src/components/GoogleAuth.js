import React, { useEffect } from 'react';

const GoogleAuth = () => {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: GOOGLE_CLIENT_ID,
        scope: 'email',
      });
    });
  }, []);

  return (
    <div>
      <div>google auth</div>
    </div>
  );
};

export default GoogleAuth;
