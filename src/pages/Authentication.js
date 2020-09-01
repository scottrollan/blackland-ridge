import React from 'react';
import * as db from '../firestore';
import $ from 'jquery';
import { Form, Button } from 'react-bootstrap';
import UserNotFound from '../components/UserNotFound';
import IncorrectPassword from '../components/IncorrectPassword';
import ResetPassword from '../components/ResetPassword';
import styles from './Authentication.module.scss';

const Authentication = ({ user }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const login = async () => {
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase())
    ) {
      db.signInUserWithEmail(email, password);
    } else {
      alert('Email format must be: user@email.com');
      return false;
    }
  };
  const signUp = () => {
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email.toLowerCase()
      ) &&
      password.length > 6
    ) {
      db.createUserWithEmail(email, password);
    } else if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
    } else {
      alert('Email format must be: user@email.com');
      return false;
    }
  };

  $('#welcome').hide();
  $('#logoutBtn').show();

  return (
    <div
      className={styles.authentication}
      id="authentication"
      style={{ display: user ? 'none' : 'flex' }}
    >
      <UserNotFound />
      <IncorrectPassword />
      <ResetPassword />
      <div id="firebaseui-auth-container" className={styles.loginWrapper}>
        <h3 style={{ marginBottom: '2rem' }}>Sign in to Blackland Ridge</h3>
        <Button
          onClick={db.signInWithFacebook}
          className={styles.facebookAuthButton}
        >
          <i className="fab fa-facebook" style={{ fontSize: 'xx-large' }}></i>
          <span style={{ fontSize: 'x-large' }}>
            {'   '}Sign in with Facebook
          </span>
        </Button>
        <Button
          onClick={db.signInWithGoogle}
          className={styles.googleAuthButton}
        >
          <i className="fab fa-google" style={{ fontSize: 'xx-large' }}></i>
          <span style={{ fontSize: 'x-large' }}>
            {'   '}Sign in with Google
          </span>{' '}
        </Button>

        <Button
          onClick={db.signInWithTwitter}
          className={styles.twitterAuthButton}
        >
          <i className="fab fa-twitter" style={{ fontSize: 'xx-large' }}></i>
          <span style={{ fontSize: 'x-large' }}>
            {'   '}Sign in with Twitter
          </span>
        </Button>
        <h5 style={{ marginTop: '1rem' }}>or sign in with your email</h5>

        <Form style={{ width: 'var(--button-width' }}>
          <Form.Control
            className={styles.input}
            type="email"
            id="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
          <Form.Control
            className={styles.input}
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
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
        </Form>
        <Button
          onClick={db.signInAnonymously}
          className={styles.anonymousAuthButton}
        >
          <i className="fas fa-user-slash" style={{ fontSize: 'xx-large' }}></i>
          <span style={{ fontSize: 'x-large' }}>{'  '}Stay Anonymous</span>
        </Button>
        <span style={{ fontSize: 'smaller' }}>
          (you will only be allowed to view--no posting, commenting or liking)
        </span>
      </div>
    </div>
  );
};
export default Authentication;