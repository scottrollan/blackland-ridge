import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import * as db from '../firestore';
import styles from './FadeInMessage.module.scss';

const ErrorMessage = ({
  errorMessage,
  tryAgainBtn,
  tryAgainText,
  resetBtn,
  idFromProps,
}) => {
  const resetPassword = (email) => {
    db.sendResetPassword(email);
    $('#errorMessage').hide();
  };

  const closeErrorMessagePopup = () => {
    if (idFromProps) {
      $(`#${idFromProps}`).css('display', 'none');
    } else {
      $('#errorMessage').css('display', 'none');
    }
  };

  return (
    <div
      className={styles.alertDiv}
      id={idFromProps === '' ? 'errorMessage' : idFromProps}
    >
      <div className={styles.fadeIn}>
        <h4>{errorMessage}</h4>
        <div className={styles.buttonRow}>
          <Button
            variant="warning"
            onClick={() => closeErrorMessagePopup()}
            style={{
              display: `${tryAgainBtn}`,
              margin: '1rem 0.5rem',
              fontSize: 'large',
            }}
          >
            {tryAgainText}
          </Button>
          <Button
            variant="danger"
            onClick={() => resetPassword($('#email').val())}
            style={{
              display: `${resetBtn}`,
              margin: '1rem 0.5rem',
              fontSize: 'x-large',
            }}
          >
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
