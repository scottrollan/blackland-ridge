import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import styles from './Authentication.module.scss';

const GoogleAuth = ({ onClick }) => {
  let auth;

  const loadGAPI = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          clientId:
            '177194986194-l7mlcn333elj2iessc3smne89dlihk4l.apps.googleusercontent.com',
          scope: 'email',
        })
        .then(() => {
          auth = window.gapi.auth2.getAuthInstance();
          const loggedIn = auth.isSignedIn.get();
          $('#googleAuthButton').attr('loggedin', loggedIn);
        });
    });
  };

  useEffect(() => {
    loadGAPI();
  }, []);

  return (
    <div>
      <Button
        id="googleAuthButton"
        className={styles.googleAuthButton}
        loggedin="false"
        onClick={onClick}
      >
        <i className="fab fa-google"></i>
        {'  '}Login with Google
      </Button>
    </div>
  );
};

export default GoogleAuth;
