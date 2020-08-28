import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import GoogleAuth from './GoogleAuth';
import FacebookAuth from './FacebookAuth';
import styles from './Authentication.module.scss';

const Authentication = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState(null);

  const responseFacebook = (response) => {
    console.log(response);
    // if (response) {
    //   setIsLoggedIn(true);
    //   setUserID(response.id);
    //   setName(response.name);
    //   setPicture(response.picture.data.url);
    // }
  };
  const responseGoogle = () => {
    const isSignedInGoogle = window.gapi.auth2
      .getAuthInstance()
      .isSignedIn.get();
    $(`#googleAuthButton`).attr('loggedin', isSignedInGoogle);
  };

  const componentClicked = (who) => {
    console.log(who, 'clicked');
  };

  let loginContent;

  if (isLoggedIn === true) {
    loginContent = (
      <div className={styles.personWrapper}>
        <img src={picture} alt="" style={{ width: '30%' }} />
        <p>{name}</p>
      </div>
    );
  } else {
    loginContent = (
      <div>
        <FacebookAuth
          // appId="1004857033295756"
          // autoload={false}
          onClick={() => componentClicked('Facebook')}
          // callback={() => responseFacebook()}
          // fields="name,email,picture"
        />
        <GoogleAuth onClick={() => responseGoogle()} />
      </div>
    );
  }

  useEffect(() => {
    console.log(isLoggedIn);
  }, []);
  return (
    <div>
      <div>{loginContent}</div>
    </div>
  );
};
export default Authentication;
