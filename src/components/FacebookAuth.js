import React from 'react';
import FacebookLogin from 'react-facebook-login';
import styles from './Authentication.module.scss';

const FacebookAuth = ({ onClick }) => {
  const responseFacebook = (response) => {
    console.log(response);
    // if (response) {
    //   setIsLoggedIn(true);
    //   setUserID(response.id);
    //   setName(response.name);
    //   setPicture(response.picture.data.url);
    // }
  };

  return (
    <div>
      <FacebookLogin
        className={styles.facebookAuthButton}
        appId="1004857033295756"
        autoload={false}
        fields="name,email,picture"
        callback={() => responseFacebook()}
        onClick={onClick}
      />
    </div>
  );
};

export default FacebookAuth;
