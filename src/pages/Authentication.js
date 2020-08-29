import React from 'react';
import * as db from '../firestore';
import { Form, Button } from 'react-bootstrap';
import styles from './Authentication.module.scss';

const Authentication = ({ user }) => {
  return (
    <div
      className={styles.authentication}
      style={{ display: user ? 'none' : 'flex' }}
    >
      <div id="firebaseui-auth-container" className={styles.loginWrapper}>
        <div className={styles.buttons}>
          <Button
            onClick={db.signInWithGoogle}
            className={styles.googleAuthButton}
          >
            <i className="fab fa-google" style={{ fontSize: 'xx-large' }}></i>
            <span> {'   '}Sign in with Google</span>{' '}
          </Button>
          <Button
            onClick={db.signInWithFacebook}
            className={styles.facebookAuthButton}
          >
            <i className="fab fa-facebook" style={{ fontSize: 'xx-large' }}></i>
            <span>{'   '}Sign in with Facebook</span>
          </Button>
          <Form>
            <h3>Sign in with your email</h3>
            <Form.Control type="email"></Form.Control>
            <Form.Label>Email</Form.Label>
            <Form.Control type="password"></Form.Control>
            <Form.Label>Password</Form.Label>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Authentication;
