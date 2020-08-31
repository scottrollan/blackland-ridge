import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import styles from './FadeInMessage.module.scss';

const UserNotFound = () => {
  return (
    <div className={styles.alertDiv} id="userNotFound">
      <div className={styles.fadeIn}>
        <h5>That email is was not found.</h5>
        <h6>Try again or Sign Up</h6>
        <Button
          variant="secondary"
          onClick={() => $('#userNotFound').css('display', 'none')}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default UserNotFound;
