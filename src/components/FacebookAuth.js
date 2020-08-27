import React from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookAuth = ({ appId, autoload, fields, onClick, callback }) => {
  return (
    <div>
      <FacebookLogin
        appId={appId}
        autoLoad={autoload}
        fields={fields}
        onClick={onClick}
        callback={callback}
      />
    </div>
  );
};

export default FacebookAuth;
