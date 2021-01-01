import React, { useContext, useState } from 'react';
import ProfileForm from '../../components/ProfileForm';
import ErrorMessage from '../../components/ErrorMessage';
import { UserContext } from '../../App';
import { Spinner } from 'react-bootstrap';
import $ from 'jquery';
import styles from './MyProfile.module.scss';

const MyProfile = () => {
  const thisUser = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [tryAgainText, setTryAgainText] = useState('OK');
  const tryAgainBtn = 'inherit';
  const resetBtn = 'none';

  const setError = (message, buttonText) => {
    setErrorMessage(message);
    setTryAgainText(buttonText);
    $('#errorMessage').css('display', 'flex');
  };

  return thisUser ? (
    <div className={styles.myProfile}>
      <ProfileForm thisUser={thisUser} setError={setError} />
      <ErrorMessage
        errorMessage={errorMessage}
        tryAgainText={tryAgainText}
        tryAgainBtn={tryAgainBtn}
        resetBtn={resetBtn}
      />
    </div>
  ) : (
    <div className={styles.myProfile}>
      <Spinner animation="grow" variant="dark" />
    </div>
  );
};

export default MyProfile;
