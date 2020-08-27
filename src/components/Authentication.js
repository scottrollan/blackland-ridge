import React, { useState } from 'react';
import GoogleAuth from './GoogleAuth';
import FacebookLogin from 'react-facebook-login';
import FacebookAuth from './FacebookAuth';

const Authentication = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState(null);

  const responseFacebook = (response) => {
    if (response) {
      setIsLoggedIn(true);
      setUserID(response.id);
      setName(response.name);
      setPicture(response.picture.data.url);
    }
  };

  const componentClicked = () => {
    console.log('clicked');
  };

  let loginContent;

  if (isLoggedIn) {
    loginContent = (
      <div
        style={{
          width: '400px',
          backgroundColor: '#f3f3f3',
          diplay: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: '2rem',
        }}
      >
        <img src={picture} alt="" style={{ width: '30%' }} />
        <p>{name}</p>
      </div>
    );
  } else {
    loginContent = (
      <FacebookAuth
        appId="1004857033295756"
        // autoLoad={true}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={() => responseFacebook()}
      />
    );
  }

  return (
    <div>
      <div>{loginContent}</div>
      <GoogleAuth />
    </div>
  );
};
export default Authentication;
