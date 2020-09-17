import React, { useState } from 'react';
import { UserContext } from '../App';
import * as db from '../firestore';
import { Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
import ErrorMessage from '../components/ErrorMessage';
import ResetPassword from '../components/ResetPassword';
import styles from './Authentication.module.scss';

const Authentication = ({ show }) => {
  // const user = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('Error!');
  const tryAgainBtn = useState('inherit');
  const [tryAgainText, setTryAgainText] = useState('Try Again');
  const [resetBtn, setResetBtn] = useState('none'); //what display: is

  const login = async () => {
    if (/\S+@\S+/.test(email.toLowerCase())) {
      const returned = await db.signInUserWithEmail(email, password);
      if (returned === 'incorrectPassword') {
        setErrorMessage('Incorrect Password');
        setTryAgainText('OK, Try Again');
        setResetBtn('block');
        $('#errorMessage').css('display', 'flex');
      }
      if (returned === 'userNotFound') {
        setErrorMessage('That User Account Was Not Found');
        setTryAgainText('Try Again or Sign Up');
        setResetBtn('none');
        $('#errorMessage').css('display', 'flex');
      }
      if (returned === 'tooManyAttempts') {
        setErrorMessage(
          'Too many unsuccessful login attempts. Please try again later.'
        );
        setTryAgainText('Close');
        setResetBtn('none');
        $('#errorMessage').css('display', 'flex');
      }
    } else {
      setErrorMessage('Email format must be: user@email.com');
      setTryAgainText('OK, Enter a Valid Email Address');
      $('#errorMessage').css('display', 'flex');
      setResetBtn('none');
      return false;
    }
  };
  const signUp = async () => {
    if (/\S+@\S+/.test(String(email).toLowerCase()) && password.length > 6) {
      const returned = await db.createUserWithEmail(email, password);
      if (returned === 'userAlreadyExists') {
        setErrorMessage('That User Already Exists');
        setTryAgainText('Try Again');
        setResetBtn('block');
        $('#errorMessage').css('display', 'flex');
      }
      // console.log(user);
      // return user;
    } else if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setTryAgainText('OK, Enter a Longer Password');

      $('#errorMessage').css('display', 'flex');
    } else {
      setErrorMessage('Email format must be: user@email.com');
      setTryAgainText('OK, Enter a Valid Email Address');
      $('#errorMessage').css('display', 'flex');
      return false;
    }
  };

  return (
    <Modal
      id="firebaseui-auth-container"
      show={show}
      size="lg"
      style={{ marginTop: '80px' }}
    >
      <ErrorMessage
        errorMessage={errorMessage}
        tryAgainBtn={tryAgainBtn}
        tryAgainText={tryAgainText}
        resetBtn={resetBtn}
      />
      <ResetPassword />
      <div className={styles.split}>
        <div className={styles.imageHalf}></div>
        <div className={styles.wordsHalf}>
          <Modal.Header style={{ justifyContent: 'center' }}>
            <Modal.Title style={{ textAlign: 'center' }}>
              Sign in to Blackland Ridge
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <Button
              onClick={db.signInWithFacebook}
              className={styles.facebookAuthButton}
            >
              <i className={[`fab fa-facebook ${styles.authLogin}`]}></i>
              <span className={styles.authLogin}>
                {'   '}Sign in with Facebook
              </span>
            </Button>
            <Button
              onClick={db.signInWithGoogle}
              className={styles.googleAuthButton}
            >
              <i className={[`fab fa-google ${styles.authLogin}`]}></i>
              <span className={styles.authLogin}>
                {'   '}Sign in with Google
              </span>{' '}
            </Button>

            <Button
              onClick={db.signInWithTwitter}
              className={styles.twitterAuthButton}
            >
              <i className={[`fab fa-twitter ${styles.authLogin}`]}></i>
              <span className={styles.authLogin}>
                {'   '}Sign in with Twitter
              </span>
            </Button>

            <div className={styles.form}>
              <h5 style={{ textAlign: 'center' }}>
                or sign in with your email
              </h5>
              <input
                className={styles.input}
                type="email"
                id="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
              <input
                className={styles.input}
                type="password"
                id="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Button
                  onClick={() => login()}
                  variant="light"
                  className={styles.loginForm}
                >
                  Log In
                </Button>
                <Button
                  onClick={() => signUp()}
                  variant="light"
                  className={styles.signupForm}
                >
                  Sign Up
                </Button>
              </div>
            </div>
            {/* <Button
              onClick={db.signInAnonymously}
              className={styles.anonymousAuthButton}
            >
              <i className={[`fas fa-user-slash ${styles.authLogin}`]}></i>
              <span className={styles.authLogin}>{'  '}Stay Anonymous</span>
            </Button> */}
            <Button onClick={() => db.signOut()}>Log off!</Button>
            {/* <span
              style={{
                fontSize: 'smaller',
                width: '90%',
                textAlign: 'center',
              }}
            >
              (you will only be allowed to view--no posting, commenting or
              liking)
            </span> */}
          </Modal.Body>
        </div>
      </div>
    </Modal>
  );
};
export default Authentication;
