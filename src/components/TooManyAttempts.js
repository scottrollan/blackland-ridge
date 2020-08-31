import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import styles from './FadeInMessage.module.scss';

const TooManyAttempts = () => {
  return (
    <div className={styles.alertDiv} id="tooManyAttempts">
      <div className={styles.fadeIn}>
        <h4>Too many unsuccessful login attempts. Please try again later.</h4>
        <Button
          variant="secondary"
          onClick={() => $('#TooManyAttempts').css('display', 'none')}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default TooManyAttempts;
