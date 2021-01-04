import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { Modal } from 'react-bootstrap';
import $ from 'jquery';
import ProfileForm from './ProfileForm';
import ErrorMessage from '../components/ErrorMessage';

const Profile = () => {
  const thisUser = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tryAgainText, setTryAgainText] = useState('OK');
  const tryAgainBtn = 'inherit';
  const resetBtn = 'none';

  const setError = (errorMessage, buttonText) => {
    setErrorMessage(errorMessage);
    setTryAgainText(buttonText);
    $('#errorMessage').css('display', 'flex');
  };

  const handleClose = () => {
    console.log('handleClose engaged');
    setShow(false);
  };

  useEffect(() => {
    if (thisUser && (!thisUser.address || !thisUser.name)) {
      setShow(true);
    }
  });

  return (
    <Modal
      show={show}
      id="profileModal"
      backdrop="static"
      data-keyboard={false}
    >
      <ErrorMessage
        errorMessage={errorMessage}
        tryAgainBtn={tryAgainBtn}
        tryAgainText={tryAgainText}
        resetBtn={resetBtn}
      />
      <Modal.Header>Please Complete Your Profile</Modal.Header>

      <Modal.Body>
        <ProfileForm
          thisUser={thisUser}
          handleClose={handleClose}
          setError={(errorMessage, buttonText) =>
            setError(errorMessage, buttonText)
          }
        />
      </Modal.Body>
    </Modal>
  );
};

export default Profile;
