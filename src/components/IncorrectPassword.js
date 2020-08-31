import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import styles from './FadeInMessage.module.scss';

const IncorrectPassword = () => {
  const resetPassword = () => {
    $('#incorrectPassword').hide();
  };

  return (
    <div className={styles.alertDiv} id="incorrectPassword">
      <div className={styles.fadeIn}>
        <h5>Incorrect Password.</h5>
        <Button
          variant="secondary"
          onClick={() => $('#incorrectPassword').css('display', 'none')}
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

export default IncorrectPassword;
