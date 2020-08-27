import React from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookAuth = ({ appId, fields, onClick, callback }) => {
  return (
    <div>
      <FacebookLogin
        appId={appId}
        autoLoad={false}
        fields={fields}
        onClick={onClick}
        callback={callback}
      />
    </div>
  );
};

export default FacebookAuth;
