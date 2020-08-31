import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import styles from './FadeInMessage.module.scss';

const ResetPassword = () => {
  return (
    <div className={styles.alertDiv} id="resetPassword">
      <div className={styles.fadeIn}>
        <h5>An email has been sent to your address.</h5>
        <h6>Please click the link in the email to reset your password.</h6>
        <Button
          variant="secondary"
          onClick={() => $('#resetPassword').css('display', 'none')}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
