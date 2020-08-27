import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { findAllByDisplayValue } from '@testing-library/react';

const Authentication = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState(null);

  const responseFacebook = (response) => {
    console.log(response.email);
  };

  const componentClicked = () => {
    console.log('clicked');
  };

  let fbContent;

  if (isLoggedIn) {
    fbContent = (
      <div
        style={{
          width: '400px',
          margin: 'auto',
        }}
      ></div>
    );
  } else {
    fbContent = (
      <FacebookLogin
        appId="1004857033295756"
        autoLoad={true}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={responseFacebook}
      />
    );
  }

  return <div>{fbContent}</div>;
};

export default Authentication;
