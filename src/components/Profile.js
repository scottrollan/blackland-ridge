import React, { useState, useContext } from 'react';
import { UserContext } from '../App';
import { Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
import ProfileForm from './ProfileForm';
import * as db from '../firestore';
// import StreetAddress from '../components/StreetAddress';
import ErrorMessage from '../components/ErrorMessage';
import styles from './Profile.module.scss';

const Profile = () => {
  const thisUser = useContext(UserContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [tryAgainText, setTryAgainText] = useState('OK');
  const tryAgainBtn = 'inherit';
  const resetBtn = 'none';

  const setError = (errorMessage, buttonText) => {
    setErrorMessage(errorMessage);
    setTryAgainText(buttonText);
    $('#errorMessage').css('display', 'flex');
  };

  return (
    <Modal
      show={thisUser && (!thisUser.address || !thisUser.name) ? true : false}
      id="profile"
      backdrop="static"
      data-keyboard={false}
    >
      <ErrorMessage
        errorMessage={errorMessage}
        tryAgainBtn={tryAgainBtn}
        tryAgainText={tryAgainText}
        resetBtn={resetBtn}
      />
      <Modal.Header>Profile Setup</Modal.Header>

      <Modal.Body>
        <ProfileForm
          thisUser={thisUser}
          setError={(errorMessage, buttonText) =>
            setError(errorMessage, buttonText)
          }
        />
      </Modal.Body>
    </Modal>
  );
};

export default Profile;
