import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import * as db from '../firestore';
import styles from './FadeInMessage.module.scss';

const IncorrectPassword = () => {
  const resetPassword = (email) => {
    console.log(email);
    db.sendResetPassword(email);
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
        <Button
          variant="danger"
          onClick={() => resetPassword($('#email').val())}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
};

export default IncorrectPassword;
