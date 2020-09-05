import React from 'react';
import * as db from '../firestore';
// import $ from 'jquery';
import { Button, Modal } from 'react-bootstrap';
import UserNameModal from '../components/UserNameModal';
import UserNotFound from '../components/UserNotFound';
import IncorrectPassword from '../components/IncorrectPassword';
import ResetPassword from '../components/ResetPassword';
import styles from './Authentication.module.scss';

const Authentication = ({ isLoggedIn }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [selectedName, setSelectedName] = React.useState('');
  const [usernameShow, setUsernameShow] = React.useState(false);

  const login = async () => {
    if (
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase())
    ) {
      db.signInUserWithEmail(email, password);
    } else {
      alert('Email format must be: user@email.com');
      return false;
    }
  };
  const signUp = () => {
    if (
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase()) &&
      password.length > 6
    ) {
      setUsernameShow(true);
    } else if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
    } else {
      alert('Email format must be: user@email.com');
      return false;
    }
  };

  const finishSignUp = () => {
    db.createUserWithEmail(email, password);
  };

  // React.useEffect(() => {
  //   setUsernameShow(false);
  // }, []);

  return (
    <Modal id="firebaseui-auth-container" scrollable show={!isLoggedIn}>
      <UserNotFound />
      <IncorrectPassword />
      <ResetPassword />
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
          <span className={styles.authLogin}>{'   '}Sign in with Facebook</span>
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
          <span className={styles.authLogin}>{'   '}Sign in with Twitter</span>
        </Button>
        <h5 style={{ marginTop: '1rem' }}>or sign in with your email</h5>
        <div className={styles.form}>
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
            <UserNameModal
              signUp={finishSignUp}
              nameInput={selectedName}
              setName={setSelectedName}
              show={usernameShow}
            />
          </div>
        </div>
        <Button
          onClick={db.signInAnonymously}
          className={styles.anonymousAuthButton}
        >
          <i className={[`fas fa-user-slash ${styles.authLogin}`]}></i>
          <span className={styles.authLogin}>{'  '}Stay Anonymous</span>
        </Button>
        <span style={{ fontSize: 'smaller' }}>
          (you will only be allowed to view--no posting, commenting or liking)
        </span>
      </Modal.Body>
    </Modal>
  );
};
export default Authentication;
