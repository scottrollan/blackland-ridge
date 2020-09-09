import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import styles from './FadeInMessage.module.scss';

const UserAlreadyExists = () => {
  const resetPassword = () => {
    $('#userAlreadyExists').hide();
  };

  return (
    <div className={styles.alertDiv} id="userAlreadyExists">
      <div className={styles.fadeIn}>
        <h5>A user with that email already exists.</h5>
        <Button
          variant="secondary"
          onClick={() => $('#userAlreadyExists').css('display', 'none')}
        >
          Try Again
        </Button>
        <Button variant="danger" onClick={() => resetPassword()}>
          Reset Password
        </Button>
      </div>
    </div>
  );
};

export default UserAlreadyExists;
